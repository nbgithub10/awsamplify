export const recyclabilityData = {
  title: "Recyclability of Materials",
  multipleChoice: [
    {
      id: "recyclability-mc-1",
      question: "What percentage of recycled steel is used in a Basic Oxygen Furnace (BOF)?",
      options: ["10%", "25%", "50%", "100%"],
      correctAnswer: 1,
      explanation: "BOF (basic oxygen furnace) uses 25% recycled steel in its process."
    },
    {
      id: "recyclability-mc-2",
      question: "What percentage of recycled steel is used in an Electric Arc Furnace (EAF)?",
      options: ["25%", "50%", "75%", "100%"],
      correctAnswer: 3,
      explanation: "EAF (electric arc furnace) can use 100% recycled steel in its process."
    },
    {
      id: "recyclability-mc-3",
      question: "Which steel recycling method uses a higher percentage of recycled steel?",
      options: ["Basic Oxygen Furnace (BOF)", "Electric Arc Furnace (EAF)", "Both use the same percentage", "Neither uses recycled steel"],
      correctAnswer: 1,
      explanation: "EAF uses 100% recycled steel, while BOF only uses 25% recycled steel."
    },
    {
      id: "recyclability-mc-4",
      question: "What is a major characteristic of recycled concrete compared to original concrete?",
      options: ["It is stronger", "It is weaker", "It has the same strength", "It cannot be used at all"],
      correctAnswer: 1,
      explanation: "Recycled concrete is weaker than the original product."
    },
    {
      id: "recyclability-mc-5",
      question: "What is the most common use for recycled concrete?",
      options: ["Structural beams", "Rubble", "Decorative elements", "Road surfacing"],
      correctAnswer: 1,
      explanation: "Recycled concrete is usually used as rubble after being crushed and broken down."
    },
    {
      id: "recyclability-mc-6",
      question: "Which of the following is NOT a use for recycled wood?",
      options: ["Furniture", "Pallets", "Garden mulch", "Steel reinforcement"],
      correctAnswer: 3,
      explanation: "Recycled wood can be used for furniture, pallets, garden mulch, playground covering, wood composites, and paper/cardboard. Steel reinforcement is not a wood product."
    },
    {
      id: "recyclability-mc-7",
      question: "What can wood chips be used for in recycling?",
      options: ["Only garden mulch", "Only playground covering", "Garden mulch and playground covering", "Only paper products"],
      correctAnswer: 2,
      explanation: "Wood chips can be used for garden mulch and playground covering."
    },
    {
      id: "recyclability-mc-8",
      question: "What factor affects wood recyclability?",
      options: ["Color of the wood", "Type of wood", "Age of the tree", "Geographic origin"],
      correctAnswer: 1,
      explanation: "Wood recycling is dependent on the type of wood."
    },
    {
      id: "recyclability-mc-9",
      question: "How is asphalt recycled?",
      options: ["Melted and reused directly", "Crushed and refined with other materials added", "Cannot be recycled", "Used as concrete aggregate"],
      correctAnswer: 1,
      explanation: "Asphalt is crushed and refined with other materials added to reproduce asphalt."
    },
    {
      id: "recyclability-mc-10",
      question: "What is the limitation of recycled asphalt products?",
      options: ["Cannot be used at all", "Limited use for recycled products", "Only used once", "More expensive than new asphalt"],
      correctAnswer: 1,
      explanation: "Recycled asphalt has limited use for recycled products."
    },
    {
      id: "recyclability-mc-11",
      question: "What can recycled glass be used to produce?",
      options: ["Plastic products", "Glass again", "Concrete aggregate only", "Asphalt filler"],
      correctAnswer: 1,
      explanation: "Glass can be reused to produce glass again, making it highly recyclable."
    },
    {
      id: "recyclability-mc-12",
      question: "Which material has the most versatile recycling applications?",
      options: ["Concrete", "Asphalt", "Wood", "Glass"],
      correctAnswer: 2,
      explanation: "Wood has the most versatile recycling applications including furniture, pallets, garden mulch, playground covering, wood composites, and paper/cardboard."
    }
  ],
  shortAnswer: [
    {
      id: "recyclability-sa-1",
      question: "Compare the Basic Oxygen Furnace (BOF) and Electric Arc Furnace (EAF) methods of steel recycling. Which method is more environmentally sustainable and why?",
      sampleAnswer: "BOF uses 25% recycled steel while EAF uses 100% recycled steel. EAF is more environmentally sustainable because it can operate entirely on recycled steel, reducing the need for virgin raw materials and minimizing mining impacts. This makes EAF a more circular and resource-efficient method for steel production.",
      keyPoints: ["BOF uses 25% recycled steel", "EAF uses 100% recycled steel", "EAF is more sustainable", "Reduces need for virgin materials"]
    },
    {
      id: "recyclability-sa-2",
      question: "Explain why recycled concrete is weaker than the original product and describe the typical applications for recycled concrete.",
      sampleAnswer: "Recycled concrete is weaker than the original product because the crushing and breaking down process damages the aggregate structure and reduces the material's integrity. Due to this weakness, recycled concrete is usually used as rubble rather than for structural applications. It can be crushed, broken down, and re-used in non-load-bearing applications.",
      keyPoints: ["Weaker due to crushing process", "Damages aggregate structure", "Used as rubble", "Non-structural applications"]
    },
    {
      id: "recyclability-sa-3",
      question: "Describe the various ways wood can be recycled and explain why wood is considered one of the more versatile recyclable materials.",
      sampleAnswer: "Wood can be recycled in numerous ways: for basic uses like furniture and pallets; as chips for garden mulch and playground covering; as smaller chips to form wood composites; and recycled as paper/cardboard. However, the recyclability is dependent on the type of wood. This versatility makes wood one of the more recyclable materials as it can be repurposed across multiple industries and applications, from construction to landscaping to paper products.",
      keyPoints: ["Multiple applications (furniture, pallets, mulch, composites, paper)", "Dependent on wood type", "Cross-industry uses", "High versatility"]
    },
    {
      id: "recyclability-sa-4",
      question: "Discuss the environmental benefits of material recycling using examples from steel, glass, and wood. Why is recycling important for sustainable engineering?",
      sampleAnswer: "Material recycling provides significant environmental benefits. Steel recycling through EAF can use 100% recycled content, eliminating the need for mining virgin ore. Glass can be reused to produce glass again, creating a closed-loop system. Wood can be recycled into multiple products including furniture, composites, and paper, extending its useful life. Recycling is important for sustainable engineering because it reduces resource extraction, minimizes waste going to landfills, lowers energy consumption compared to producing virgin materials, and supports a circular economy approach to material use.",
      keyPoints: ["Reduces resource extraction", "Minimizes waste", "Lowers energy consumption", "Supports circular economy", "Examples from multiple materials"]
    }
  ]
};
