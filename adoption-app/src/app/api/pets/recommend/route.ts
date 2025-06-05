import {NextRequest, NextResponse} from "next/server";
import { prisma } from "@/utils/connect";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { income, space, freeTime, experience, kids, categories } = body;

        const hasFormData = income || space || freeTime || experience || kids;

        if (!hasFormData) {
            return NextResponse.json([]);
        }

        let petsQuery: any = {
            select: {
                id: true,
                name: true,
                species: true,
                age: true,
                desc: true,
                category: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            }
        };

        if (categories && categories.length > 0) {
            petsQuery.where = {
                catSlug: {
                    in: categories
                }
            };
        }

        const allPets = await prisma.pet.findMany(petsQuery);

        if (allPets.length === 0) {
            return NextResponse.json([]);
        }

        const filters = {
            income,
            space,
            freeTime,
            experience,
            kids
        };

        const prompt = `
        You are a pet recommendation expert. Based on the user's lifestyle and preferences, recommend the most suitable pets from the available options.
        
        User Information:
        - Monthly Income: ${filters.income || 'Not specified'}
        - Living Situation: ${filters.space || 'Not specified'}
        - Free Time per Week: ${filters.freeTime || 'Not specified'}
        - Pet Experience Level: ${filters.experience || 'Not specified'}
        - Has Children: ${filters.kids || 'Not specified'}
        
        Available Pets (JSON format):
        ${JSON.stringify(allPets, null, 2)}
        
        Instructions:
        1. Consider the user's income for pet care costs (food, vet bills, supplies)
        2. Match living space with pet size and exercise needs
        3. Consider time commitment required for different pets
        4. Factor in experience level - recommend easier pets for beginners
        5. Consider child safety and pet temperament if children are present
        
        Return ONLY a JSON array of the pet IDs that are most suitable, ordered by best match first.
        
        Do not include any explanations or additional text - just the JSON array of string Ids.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const aiResponse = response.choices[0].message.content?.trim() || "";

        if (!aiResponse) {
            return NextResponse.json({ message: "No response from AI" }, { status: 500 });
        }

        let recommendedPetIds;
        try {
            recommendedPetIds = JSON.parse(aiResponse);
        } catch (error) {
            console.error("Failed to parse AI response:", aiResponse);

            const arrayMatch = aiResponse.match(/\[[\d,\s]+\]/);
            if (arrayMatch) {
                try {
                    recommendedPetIds = JSON.parse(arrayMatch[0]);
                } catch (e) {
                    return NextResponse.json({ message: "Invalid AI response format" }, { status: 500 });
                }
            } else {
                return NextResponse.json({ message: "Invalid AI response format" }, { status: 500 });
            }
        }

        if (!Array.isArray(recommendedPetIds) || recommendedPetIds.length === 0) {
            return NextResponse.json([]);
        }

        const processedIds = recommendedPetIds.map(id => String(id));

        const recommendedPets = await prisma.pet.findMany({
            where: {
                id: { in: processedIds }
            },
            include: {
                category: true
            }
        });

        const sortedPets = processedIds.map(id => recommendedPets.find(pet => pet.id === id)).filter(Boolean);
        return NextResponse.json(sortedPets);
    } catch (error) {
        console.error("Error recommending pets:", error);
        return NextResponse.json({ message: "Failed to get pet recommendations" }, { status: 500 });
    }
}