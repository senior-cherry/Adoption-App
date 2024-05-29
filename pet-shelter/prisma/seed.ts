const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seed() {
    await prisma.pet.createMany({
        data: [
            {
                name: "Рекс",
                species: "Німецька вівчарка",
                age: "3 роки",
                gender: "Хлопчик",
                desc: "Дорослий самець німецької вівчарки, добре виконує команди і любить плавати",
                imageUrl: "michael-dziedzic-si06cFB0g1s-unsplash.jpg",
                catSlug: "Собаки"
            },
            {
                name: "Рекс",
                species: "Німецька вівчарка",
                age: "3 роки",
                gender: "Хлопчик",
                desc: "Дорослий самець німецької вівчарки, добре виконує команди і любить плавати",
                imageUrl: "michael-dziedzic-si06cFB0g1s-unsplash.jpg",
                catSlug: "Собаки"
            }
        ]
    })
}

seed()
    .catch((e) => {
        console.error(e)
    })
