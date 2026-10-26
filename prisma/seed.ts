
import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Début du seed...");

  // 1. Créer les catégories sans les dupliquer
  const categoryNames = [
    "Électronique",
    "Accessoires",
    "Informatique",
  ];

  const categories = new Map<string, number>();

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    categories.set(name, category.id);
    console.log(`Catégorie vérifiée : ${category.name}`);
  }

  // 2. Définir les produits de démonstration
  const products = [
    {
      title: "Casque Bluetooth",
      description: "Casque sans fil avec une bonne qualité sonore.",
      price: "89.00",
      image: "",
      categoryName: "Électronique",
    },
    {
      title: "Montre connectée",
      description: "Montre connectée pour le suivi des activités.",
      price: "149.00",
      image: "",
      categoryName: "Électronique",
    },
    {
      title: "Sac à dos",
      description: "Sac à dos pratique pour les déplacements.",
      price: "59.00",
      image: "",
      categoryName: "Accessoires",
    },
    {
      title: "Lunettes de soleil",
      description: "Lunettes de soleil pour un usage quotidien.",
      price: "35.00",
      image: "",
      categoryName: "Accessoires",
    },
    {
      title: "Clavier mécanique",
      description: "Clavier mécanique pour le travail et le gaming.",
      price: "110.00",
      image: "",
      categoryName: "Informatique",
    },
    {
      title: "Souris sans fil",
      description: "Souris sans fil pour ordinateur.",
      price: "45.00",
      image: "",
      categoryName: "Informatique",
    },
  ];

  // 3. Insérer ou actualiser chaque produit
  for (const product of products) {
    const categoryId = categories.get(product.categoryName);

    if (categoryId === undefined) {
      throw new Error(`Catégorie introuvable : ${product.categoryName}`);
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        title: product.title,
        categoryId,
      },
    });

    const data = {
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      categoryId,
    };

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data,
      });
      console.log(`Produit actualisé : ${product.title}`);
    } else {
      await prisma.product.create({ data });
      console.log(`Produit ajouté : ${product.title}`);
    }
  }

  console.log("Seed terminé avec succès !");
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
