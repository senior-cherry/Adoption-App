import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import OpenAI from "openai";
import {getTranslations} from "next-intl/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const GET = async () => {
    try {
        const adoptions = await prisma.adoption.findMany({
            where: {
                approval: "inProcess"
            }
        });
        return new NextResponse(JSON.stringify(adoptions), { status: 200 });
    } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    const r = await getTranslations("adoptionRequest");
    const q = await getTranslations("adoptionFormQuestions");
    try {
        const body = await req.json();
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: r("message") },
                { role: "user", content: `
                    ${r("species")} - ${body.species}
                    ${q("age")} - ${body.age}
                    ${q("aptType")} - ${body.aptType}
                    ${q("petsAllowed")} - ${body.petsAllowed}
                    ${q("kids")} - ${body.kids}
                    ${q("otherAnimals")} - ${body.otherAnimals}
                    ${q("liveWith")} - ${body.liveWith}
                    ${q("employmentStatus")} - ${body.employmentStatus}
                    ${q("incomeLevel")} - ${body.incomeLevel}
                    ${q("animalsBefore")} - ${body.animalsBefore}
                    ${q("nutritionalNeeds")} - ${body.nutritionalNeeds}
                    ${q("reasonToAdoptPet")} - ${body.reasonToAdoptPet}
                    ${q("characterPreferences")} - ${body.characterPreferences}
                    ${q("lifeChangingActions")} - ${body.lifeChangingActions}
                    ${q("psychologicalDiseases")} - ${body.psychologicalDiseases}
                    ${q("tendencyToBeImpulsive")} - ${body.tendencyToBeImpulsive}
                    ${q("emotionalStability")} - ${body.emotionalStability}
                    ${q("reactionToStress")} - ${body.reactionToStress}
                    ${q("uncontrolledAnger")} - ${body.uncontrolledAnger}
                    ${q("blamesForAnger")} - ${body.blamesForAnger}
                    ${q("attitudeToSpending")} - ${body.attitudeToSpending}
                    ${q("attitudeToBadBehaviour")} - ${body.attitudeToBadBehaviour}
                    ${q("requireLove")} - ${body.requireLove}
                    ${q("isAbleToFollowSchedule")} - ${body.isAbleToFollowSchedule}
                    ${q("friendlySupport")} - ${body.friendlySupport}
                    ${q("allergyToFur")} - ${body.allergyToFur}
                    ${q("howToRaisePet")} - ${body.howToRaisePet}
                    ${q("reactionToBadAction")} - ${body.reactionToBadAction}
                    ${q("isPunishmentNecessary")} - ${body.isPunishmentNecessary}
        
                    ${r("conclusion")}
        `},
            ],
        });

        const aiConclusion = aiResponse.choices[0].message.content?.trim() || "inProcess";
        const { pet_id, imageUrl, user, user_id, phoneNumber, email, address, species } = body;

        const adoption = await prisma.adoption.create({
            data: { pet_id, imageUrl, user, user_id, phoneNumber, email, address, species, aiConclusion }
        });

        return new NextResponse(JSON.stringify(adoption), { status: 201 });
    } catch (err) {
        console.error("Adoption creation error:", err);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
};
