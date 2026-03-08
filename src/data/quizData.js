export const quizData = {
  sections: {
    civil: {
      title: "Civil Structures",
      multipleChoice: [
        {
          id: "civil-mc-1",
          question: "Which type of structural member is primarily designed to resist compressive loads?",
          options: ["Tie", "Strut", "Beam", "Cable"],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-2",
          question: "A truss is an example of which type of structure?",
          options: ["Mass structure", "Frame structure", "Shell structure", "Solid structure"],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-3",
          question: "Which structural form uses a curved shape to transfer loads primarily through compression?",
          options: ["Beam", "Column", "Arch", "Cantilever"],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-4",
          question: "A dead load on a building refers to:",
          options: [
            "The weight of occupants and furniture",
            "The permanent weight of the structure itself and fixed elements",
            "The force exerted by wind on the structure",
            "The load caused by an earthquake"
          ],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-5",
          question: "Which of the following is an example of a live load?",
          options: [
            "The weight of a concrete slab",
            "The weight of roof tiles",
            "Pedestrians walking across a bridge",
            "The weight of steel beams"
          ],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-6",
          question: "When a structural member is being pulled apart from both ends, it is experiencing:",
          options: ["Compression", "Torsion", "Tension", "Shear"],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-7",
          question: "Shear force in a beam acts:",
          options: [
            "Along the length of the beam",
            "Perpendicular to the longitudinal axis",
            "As a twisting force",
            "Only at the supports"
          ],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-8",
          question: "Bending in a beam causes which combination of internal stresses?",
          options: [
            "Tension only",
            "Compression only",
            "Tension on one side and compression on the other",
            "Shear only"
          ],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-9",
          question: "Reinforced concrete uses steel reinforcement primarily to compensate for concrete's weakness in:",
          options: ["Compression", "Tension", "Hardness", "Density"],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-10",
          question: "Which material property describes a material's ability to deform plastically before fracture?",
          options: ["Hardness", "Brittleness", "Ductility", "Elasticity"],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-11",
          question: "Structural steel is commonly used in civil structures because of its high:",
          options: [
            "Brittleness and low cost",
            "Strength-to-weight ratio and ductility",
            "Thermal insulation properties",
            "Resistance to all forms of corrosion"
          ],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-12",
          question: "The factor of safety (FOS) is defined as:",
          options: [
            "The ratio of applied load to maximum load",
            "The ratio of ultimate stress to working stress",
            "The ratio of strain to stress",
            "The percentage of load-bearing capacity used"
          ],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-13",
          question: "Stress in a structural member is defined as:",
          options: [
            "Force multiplied by area",
            "Deformation per unit length",
            "Force per unit area",
            "Energy absorbed before failure"
          ],
          correctAnswer: 2,
        },
        {
          id: "civil-mc-14",
          question: "Which of the following is a significant environmental concern when using concrete in civil structures?",
          options: [
            "Concrete is non-recyclable",
            "Cement production releases large amounts of CO₂",
            "Concrete structures cannot be demolished safely",
            "Concrete has a very short service life"
          ],
          correctAnswer: 1,
        },
        {
          id: "civil-mc-15",
          question: "The use of prefabricated structural components on a construction site primarily helps to:",
          options: [
            "Increase on-site labour requirements",
            "Reduce construction time and improve quality control",
            "Eliminate the need for structural engineers",
            "Increase material waste"
          ],
          correctAnswer: 1,
        },
      ],
      shortAnswer: [
        {
          id: "civil-sa-1",
          question: "Describe the difference between a frame structure and a mass structure. Provide one example of each.",
          modelAnswer: "A frame structure is made of connected members (beams, columns) that form a skeleton, such as a steel-framed building. A mass structure relies on its own bulk and weight to resist loads, such as a concrete dam. Frame structures are lightweight and efficient; mass structures are heavy and solid."
        },
        {
          id: "civil-sa-2",
          question: "Explain the function of a truss in a roof system and why triangulation is important in truss design.",
          modelAnswer: "A truss distributes roof loads across multiple members to the supporting walls or columns. Triangulation is critical because triangles are inherently rigid geometric shapes — they cannot deform without changing the length of a side, making the truss stable under load."
        },
        {
          id: "civil-sa-3",
          question: "Distinguish between dead loads and live loads. Give one example of a dynamic load that a bridge might experience.",
          modelAnswer: "Dead loads are permanent, constant forces from the structure's own weight and fixed elements (e.g., concrete slabs, roof tiles). Live loads are temporary and variable, such as people or furniture. A dynamic load on a bridge could be the impact force from a heavy truck crossing or vibrations from traffic."
        },
        {
          id: "civil-sa-4",
          question: "Explain the difference between tension and compression forces acting on a structural member.",
          modelAnswer: "Tension is a pulling force that stretches a member along its axis, while compression is a pushing force that shortens a member along its axis. A cable supporting a bridge deck experiences tension; a column supporting a roof experiences compression."
        },
        {
          id: "civil-sa-5",
          question: "Describe what happens internally within a simply supported beam when a point load is applied at its centre. Refer to bending, tension, and compression in your answer.",
          modelAnswer: "When a point load is applied at the centre of a simply supported beam, the beam bends. The top fibres of the beam experience compression (shortening), while the bottom fibres experience tension (stretching). There is a neutral axis along the centre where neither tension nor compression occurs. Shear forces act at the supports."
        },
        {
          id: "civil-sa-6",
          question: "Compare the properties of steel and concrete as structural materials. Explain why they are often used together in reinforced concrete.",
          modelAnswer: "Steel has high tensile and compressive strength and good ductility, but is susceptible to corrosion and loses strength at high temperatures. Concrete has excellent compressive strength but is weak in tension and brittle. In reinforced concrete, steel reinforcement bars are placed in tension zones to compensate for concrete's tensile weakness, creating a composite material that performs well under both types of stress."
        },
        {
          id: "civil-sa-7",
          question: "Explain why timber is still used as a structural material in residential construction despite the availability of steel and concrete.",
          modelAnswer: "Timber is a renewable resource, relatively lightweight, easy to work with, and has a good strength-to-weight ratio for low-rise residential loads. It is cost-effective, readily available, provides natural thermal insulation, and has a lower carbon footprint in production compared to steel or concrete."
        },
        {
          id: "civil-sa-8",
          question: "Define the term 'factor of safety' and explain why engineers design structures with a factor of safety greater than 1.",
          modelAnswer: "The factor of safety (FOS) is the ratio of the ultimate (failure) stress of a material to the working (applied) stress. Engineers use a FOS greater than 1 to account for uncertainties in loading conditions, material defects, construction variations, and degradation over time, ensuring the structure can handle loads beyond normal expectations."
        },
        {
          id: "civil-sa-9",
          question: "Explain the difference between stress and strain in the context of structural analysis.",
          modelAnswer: "Stress is the internal force per unit area within a material (measured in Pascals, Pa). Strain is the deformation (change in length) per unit original length (dimensionless ratio). Stress describes how much force a material is resisting internally, while strain describes how much it has physically deformed."
        },
        {
          id: "civil-sa-10",
          question: "Discuss one environmental impact and one societal benefit of large-scale civil structure projects such as dams or highway bridges.",
          modelAnswer: "Environmental impact: Large dam projects can flood ecosystems, displace wildlife habitats, and alter river flow patterns, affecting downstream ecology. Societal benefit: Highway bridges connect communities, reduce travel times, improve access to services, employment, and emergency response, and support regional economic growth."
        },
      ]
    },
    transport: {
      title: "Personal and Public Transport",
      multipleChoice: [
        {
          id: "transport-mc-1",
          question: "In a four-stroke petrol engine, the correct order of strokes is:",
          options: [
            "Intake, Power, Compression, Exhaust",
            "Intake, Compression, Power, Exhaust",
            "Compression, Intake, Power, Exhaust",
            "Power, Intake, Exhaust, Compression"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-2",
          question: "A two-stroke engine completes one power cycle in:",
          options: [
            "One revolution of the crankshaft",
            "Two revolutions of the crankshaft",
            "Four revolutions of the crankshaft",
            "Half a revolution of the crankshaft"
          ],
          correctAnswer: 0,
        },
        {
          id: "transport-mc-3",
          question: "Compared to a petrol engine, a diesel engine ignites its fuel by:",
          options: [
            "A spark plug",
            "An electric coil",
            "Compression of air raising its temperature",
            "A glow wire in the combustion chamber at all times"
          ],
          correctAnswer: 2,
        },
        {
          id: "transport-mc-4",
          question: "The purpose of a clutch in a manual transmission is to:",
          options: [
            "Change gear ratios automatically",
            "Temporarily disconnect the engine from the drivetrain",
            "Increase engine power",
            "Lubricate the gearbox"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-5",
          question: "A differential in a vehicle allows:",
          options: [
            "The engine to idle at traffic lights",
            "The front and rear axles to share power equally",
            "The driven wheels to rotate at different speeds during cornering",
            "The transmission to shift gears smoothly"
          ],
          correctAnswer: 2,
        },
        {
          id: "transport-mc-6",
          question: "A continuously variable transmission (CVT) differs from a conventional automatic transmission because it:",
          options: [
            "Uses a torque converter only",
            "Has a fixed number of gear ratios",
            "Provides an infinite range of gear ratios within its limits",
            "Requires a clutch pedal"
          ],
          correctAnswer: 2,
        },
        {
          id: "transport-mc-7",
          question: "In a hydraulic disc brake system, pressing the brake pedal creates pressure that is transmitted through:",
          options: [
            "Steel cables",
            "Brake fluid",
            "Compressed air",
            "Electric current"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-8",
          question: "The primary function of an Anti-lock Braking System (ABS) is to:",
          options: [
            "Reduce brake pad wear",
            "Increase braking force",
            "Prevent wheels from locking up during hard braking to maintain steering control",
            "Automatically apply the handbrake"
          ],
          correctAnswer: 2,
        },
        {
          id: "transport-mc-9",
          question: "The main function of a vehicle's suspension system is to:",
          options: [
            "Transmit power from the engine to the wheels",
            "Absorb road shocks and maintain tyre contact with the road",
            "Steer the vehicle around corners",
            "Reduce fuel consumption"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-10",
          question: "In a MacPherson strut suspension, the strut assembly combines which two components?",
          options: [
            "Leaf spring and shock absorber",
            "Coil spring and shock absorber",
            "Torsion bar and anti-roll bar",
            "Air spring and linkage"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-11",
          question: "Aluminium alloys are increasingly used in vehicle body panels because they offer:",
          options: [
            "Higher density than steel resulting in better crash protection",
            "Lower weight than steel while maintaining adequate strength",
            "Greater stiffness than carbon fibre",
            "Lower cost than all other metals"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-12",
          question: "Which material is commonly used for engine blocks due to its good castability and ability to dissipate heat?",
          options: [
            "Titanium",
            "Carbon fibre composite",
            "Cast iron or aluminium alloy",
            "Stainless steel"
          ],
          correctAnswer: 2,
        },
        {
          id: "transport-mc-13",
          question: "Polymer composites (such as fibreglass) are used in vehicle body parts primarily because they:",
          options: [
            "Conduct electricity well",
            "Are lightweight, corrosion-resistant, and can be moulded into complex shapes",
            "Have higher melting points than metals",
            "Are cheaper than all metals"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-14",
          question: "Catalytic converters were introduced in vehicles primarily to:",
          options: [
            "Improve engine performance",
            "Reduce harmful exhaust emissions (CO, NOx, hydrocarbons)",
            "Increase fuel economy",
            "Reduce engine noise"
          ],
          correctAnswer: 1,
        },
        {
          id: "transport-mc-15",
          question: "The shift from personal car use to public transport systems in cities is encouraged primarily to:",
          options: [
            "Increase road construction projects",
            "Reduce traffic congestion, emissions, and energy consumption per capita",
            "Increase fuel sales",
            "Eliminate the need for vehicle maintenance"
          ],
          correctAnswer: 1,
        },
      ],
      shortAnswer: [
        {
          id: "transport-sa-1",
          question: "Describe the four strokes of a four-stroke petrol engine and explain the energy transformation that occurs during the power stroke.",
          modelAnswer: "The four strokes are: (1) Intake — piston moves down, inlet valve opens, air-fuel mixture enters the cylinder; (2) Compression — piston moves up, both valves closed, mixture is compressed; (3) Power — spark plug ignites the compressed mixture, expanding gases push the piston down; (4) Exhaust — piston moves up, exhaust valve opens, burnt gases are expelled. During the power stroke, chemical energy in the fuel is converted to thermal energy (combustion), then to kinetic energy (piston movement)."
        },
        {
          id: "transport-sa-2",
          question: "Compare the operating principles of a two-stroke engine and a four-stroke engine. State one advantage and one disadvantage of a two-stroke engine.",
          modelAnswer: "A four-stroke engine completes one power cycle in two crankshaft revolutions (four piston strokes), while a two-stroke engine completes one power cycle in one crankshaft revolution (two piston strokes). Advantage of two-stroke: higher power-to-weight ratio (fires every revolution). Disadvantage: less fuel-efficient and produces more emissions because fresh charge mixes with exhaust gases."
        },
        {
          id: "transport-sa-3",
          question: "Explain the function of a manual gearbox and why lower gears provide more torque but less speed.",
          modelAnswer: "A manual gearbox uses a set of gear pairs of different sizes to provide various gear ratios between the engine and the wheels. Lower gears use a smaller driving gear meshing with a larger driven gear, which multiplies torque (turning force) at the expense of output speed. This is necessary for starting from rest or climbing hills where high force is needed."
        },
        {
          id: "transport-sa-4",
          question: "Describe the purpose and operation of a differential. Explain why it is necessary during cornering.",
          modelAnswer: "A differential is a gear mechanism in the drive axle that splits engine torque between two wheels while allowing them to rotate at different speeds. During cornering, the outer wheel must travel a greater distance than the inner wheel. Without a differential, the inner wheel would be forced to slip, causing tyre wear, poor handling, and drivetrain stress."
        },
        {
          id: "transport-sa-5",
          question: "Explain how a hydraulic disc brake system works, from the driver pressing the pedal to the vehicle slowing down.",
          modelAnswer: "When the driver presses the brake pedal, it pushes a piston in the master cylinder, pressurising the brake fluid. This hydraulic pressure is transmitted through brake lines to caliper pistons at each wheel. The caliper pistons push the brake pads against the rotating disc (rotor), creating friction. This friction converts the kinetic energy of the vehicle into thermal energy, slowing the vehicle down."
        },
        {
          id: "transport-sa-6",
          question: "Describe the role of a shock absorber in a vehicle's suspension system and explain what would happen if it failed.",
          modelAnswer: "A shock absorber (damper) controls the rate at which the suspension spring compresses and rebounds. It dissipates the kinetic energy of spring oscillation as heat by forcing hydraulic fluid through small orifices. If a shock absorber failed, the vehicle would bounce excessively after hitting a bump, reducing tyre contact with the road, compromising handling, and increasing stopping distances."
        },
        {
          id: "transport-sa-7",
          question: "Compare the use of steel and aluminium as materials for vehicle body construction. Discuss one advantage and one disadvantage of each.",
          modelAnswer: "Steel: strong, durable, and relatively inexpensive (advantage), but heavy and susceptible to rust/corrosion (disadvantage). Aluminium: lighter than steel (roughly one-third the density), improving fuel efficiency (advantage), but more expensive and more difficult to repair after crash damage (disadvantage)."
        },
        {
          id: "transport-sa-8",
          question: "Explain why composite materials (e.g., carbon fibre reinforced polymer) are used in high-performance vehicles but not commonly in everyday passenger cars.",
          modelAnswer: "Carbon fibre reinforced polymer (CFRP) offers an exceptional strength-to-weight ratio, significantly reducing vehicle mass and improving performance. However, it is very expensive to produce, difficult to manufacture at high volume, and difficult and costly to repair. These factors make it suitable for low-volume, high-performance or racing vehicles but impractical for mass-market passenger cars where cost is a primary concern."
        },
        {
          id: "transport-sa-9",
          question: "Discuss one environmental impact of the widespread use of internal combustion engine vehicles and explain one strategy that has been implemented to reduce this impact.",
          modelAnswer: "Environmental impact: ICE vehicles produce exhaust emissions including CO₂ (greenhouse gas contributing to climate change), NOx, and particulate matter that degrade air quality. One strategy to reduce this is the mandated use of catalytic converters, which chemically convert harmful exhaust gases (CO, NOx, hydrocarbons) into less harmful substances (CO₂, N₂, H₂O) before they exit the tailpipe."
        },
        {
          id: "transport-sa-10",
          question: "Explain how the development of public transport infrastructure (e.g., rail networks) can benefit both the environment and society.",
          modelAnswer: "Environmental benefit: Public transport carries many passengers per vehicle, reducing the total number of vehicles on the road, which lowers overall fuel consumption and greenhouse gas emissions per person-kilometre. Societal benefit: Rail networks improve accessibility, connecting suburbs and regional areas to employment centres, reducing commute times, lowering household transport costs, and reducing traffic congestion, improving quality of life for communities."
        },
      ]
    },
    pastPapers: {
      title: "Past Papers (2020-2025)",
      multipleChoice: [
        {
          id: "past-2020-q1",
          question: "What is the main purpose of applying a polymer coating to a copper telecommunications cable?",
          options: [
            "To insulate it",
            "To strengthen it",
            "To increase its flexibility",
            "To improve its conductivity"
          ],
          correctAnswer: 0,
        },
        {
          id: "past-2020-q2",
          question: "What is the main purpose of the flaps on the wings of an aircraft?",
          options: [
            "To make the aircraft safer at higher speeds",
            "To decrease lift to allow faster take-off speeds",
            "To increase lift at lower speeds for take-off and landing",
            "To decrease drag to allow higher take-off and landing speeds"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2020-q3",
          question: "Which of the following manufacturing methods can be used to produce complex polymer components?",
          options: [
            "Sand casting",
            "Blow moulding",
            "Lost wax casting",
            "Injection moulding"
          ],
          correctAnswer: 3,
        },
        {
          id: "past-2020-q5",
          question: "To what must the professional services of telecommunications engineers be primarily dedicated?",
          options: [
            "Completing projects on time",
            "Ensuring public health and safety",
            "Designing efficient engineering systems",
            "Reducing the legal liability of their employers"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2020-q7",
          question: "Which of the following best describes how an unpowered aircraft will glide, in controlled descent, when the lift-to-drag ratio is high?",
          options: [
            "Long distance at a steep glide angle",
            "Short distance at a steep glide angle",
            "Long distance at a shallow glide angle",
            "Short distance at a shallow glide angle"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2020-q8",
          question: "The photograph shows a transport viaduct based on a series of Roman arches. By using the Roman arch, engineers today can design structures which",
          options: [
            "are easy to construct.",
            "are quick to construct.",
            "can span long distances.",
            "place foundations in tension."
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2020-q10",
          question: "Which of the following only contains tasks performed by the aeronautical engineer?",
          options: [
            "Provide technical advice, assemble aircraft, design aircraft",
            "Assist in air traffic control, investigate crashes, pilot aircraft",
            "Make good checklists, read training manuals, schedule flights",
            "Write training manuals, assist in air traffic control, act as a public relations officer"
          ],
          correctAnswer: 0,
        },
        {
          id: "past-2020-q12",
          question: "A geostationary satellite is positioned above the equator. How many times does the satellite go around Earth's axis in a 24-hour period?",
          options: [
            "0",
            "1",
            "2",
            "3"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2020-q13",
          question: "Which of the following can be safely transmitted by fibre optic cables?",
          options: [
            "Microwaves",
            "Radio waves",
            "Gamma rays",
            "Infrared waves"
          ],
          correctAnswer: 3,
        },
        {
          id: "past-2020-q16",
          question: "Which of the following contributes to pitting or crevice corrosion in aircraft component joints?",
          options: [
            "Water levels",
            "Alloy concentrations",
            "Oxygen concentrations",
            "Levels of static electricity"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2020-q19",
          question: "Turbofan engines are generally more fuel efficient than turbojet engines. What causes this efficiency?",
          options: [
            "Smaller intake area",
            "Higher combustion temperatures",
            "Air bypassing the combustion system",
            "Air directly entering the combustion area"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2021-q3",
          question: "Which of the following is used to transmit data in a fibre optic cable?",
          options: [
            "Air pressure",
            "Infrared light",
            "Plasma radiation",
            "Electrical voltage"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2021-q9",
          question: "A pitot tube supplies two pressure readings, total pressure and static pressure. These pressure readings are then used to determine the",
          options: [
            "sealed pressure.",
            "dynamic pressure.",
            "standard pressure.",
            "hydrostatic pressure."
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2021-q13",
          question: "Two identical aircraft, Q and R, are travelling at 500 km per hour. Aircraft Q is at an altitude of 1000 m and aircraft R is at an altitude of 10 000 m. Compared to aircraft Q, aircraft R generates",
          options: [
            "less lift and less drag.",
            "less lift and more drag.",
            "more lift and less drag.",
            "more lift and more drag."
          ],
          correctAnswer: 0,
        },
        {
          id: "past-2022-q1",
          question: "What property of a material can be measured by testing its resistance to scratching?",
          options: [
            "Hardness",
            "Stiffness",
            "Strength",
            "Toughness"
          ],
          correctAnswer: 0,
        },
        {
          id: "past-2022-q2",
          question: "Which of the following best describes the change in battery-powered telecommunications products since the introduction of semiconductors?",
          options: [
            "Larger and use less power",
            "Smaller and use less power",
            "Larger and use more power",
            "Smaller and use more power"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2023-q1",
          question: "The diagram shows two connected gears. Which of the following best describes how torque is transmitted through the gears?",
          options: [
            "The larger gear increases the torque",
            "The smaller gear increases the torque",
            "Torque is transmitted equally through both gears",
            "The torque is multiplied by the gear ratio"
          ],
          correctAnswer: 3,
        },
        {
          id: "past-2023-q2",
          question: "What is the primary purpose of annealing a metal?",
          options: [
            "To increase hardness",
            "To reduce internal stresses and increase ductility",
            "To increase tensile strength",
            "To improve corrosion resistance"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2024-q1",
          question: "Which of the following materials is most commonly used for aircraft fuselage construction?",
          options: [
            "Steel",
            "Aluminium alloy",
            "Titanium",
            "Carbon fibre"
          ],
          correctAnswer: 1,
        },
        {
          id: "past-2024-q2",
          question: "What is the main advantage of using composite materials in structural applications?",
          options: [
            "Low cost",
            "Easy to repair",
            "High strength-to-weight ratio",
            "High thermal conductivity"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2025-q1",
          question: "In telecommunications, what is the main advantage of fibre optic cables over copper cables?",
          options: [
            "Lower cost",
            "Easier to install",
            "Higher bandwidth and less signal loss",
            "Better electrical conductivity"
          ],
          correctAnswer: 2,
        },
        {
          id: "past-2025-q2",
          question: "What is the purpose of a differential in a vehicle's drivetrain?",
          options: [
            "To increase power output",
            "To allow wheels to rotate at different speeds during turns",
            "To improve fuel efficiency",
            "To reduce engine noise"
          ],
          correctAnswer: 1,
        }
      ],
      shortAnswer: []
    }
  }
};
