export const ultrasonicTestingData = {
  title: "Ultrasonic Testing",
  multipleChoice: [
    {
      id: "ultrasonic-mc-1",
      question: "What is the primary purpose of ultrasonic testing?",
      options: [
        "To detect surface cracks only",
        "To measure surface roughness",
        "To detect subsurface defects",
        "To determine material color"
      ],
      correctAnswer: 2,
      explanation: "Ultrasonic testing is primarily used to detect subsurface defects within a component that are not visible on the surface."
    },
    {
      id: "ultrasonic-mc-2",
      question: "How does ultrasonic testing transmit energy through a component?",
      options: [
        "Using visible light beams",
        "Using high frequency vibrations",
        "Using magnetic fields",
        "Using electrical currents"
      ],
      correctAnswer: 1,
      explanation: "Ultrasonic testing uses a probe that transmits high frequency vibrations throughout the component as it passes over the surface."
    },
    {
      id: "ultrasonic-mc-3",
      question: "What happens when ultrasonic vibrations encounter an imperfection within a component?",
      options: [
        "The vibrations speed up and travel faster",
        "The vibrations change color",
        "The vibrations are reflected without travelling to the bottom",
        "The vibrations are absorbed completely"
      ],
      correctAnswer: 2,
      explanation: "Any imperfections within the component cause the vibration to be reflected without travelling to the bottom, indicating the presence of a defect."
    },
    {
      id: "ultrasonic-mc-4",
      question: "Where are the results of ultrasonic testing displayed?",
      options: [
        "On paper printouts only",
        "On a detection machine",
        "They cannot be displayed",
        "Only through sound signals"
      ],
      correctAnswer: 1,
      explanation: "The results of ultrasonic testing are displayed on a detection machine, which shows the reflections and helps identify defects."
    },
    {
      id: "ultrasonic-mc-5",
      question: "What is a key advantage of ultrasonic testing compared to visual inspection?",
      options: [
        "It is faster than visual inspection",
        "It is cheaper than visual inspection",
        "It can detect subsurface defects that are not visible to the eye",
        "It requires no equipment"
      ],
      correctAnswer: 2,
      explanation: "The key advantage of ultrasonic testing is its ability to detect subsurface defects that cannot be detected through visual inspection alone."
    },
    {
      id: "ultrasonic-mc-6",
      question: "What type of testing method is ultrasonic testing classified as?",
      options: [
        "Destructive testing",
        "Non-destructive testing (NDT)",
        "Chemical testing",
        "Thermal testing"
      ],
      correctAnswer: 1,
      explanation: "Ultrasonic testing is a non-destructive testing (NDT) method, meaning it can detect defects without damaging or destroying the component being tested."
    },
    {
      id: "ultrasonic-mc-7",
      question: "In ultrasonic testing, what does a reflected vibration signal indicate?",
      options: [
        "The material is perfect with no defects",
        "The material is too thick",
        "There is an imperfection or defect in the component",
        "The test has failed"
      ],
      correctAnswer: 2,
      explanation: "A reflected vibration signal in ultrasonic testing indicates that there is an imperfection or defect within the component that has caused the vibrations to bounce back."
    },
    {
      id: "ultrasonic-mc-8",
      question: "What component is essential for conducting ultrasonic testing?",
      options: [
        "A heating element",
        "A probe that transmits high frequency vibrations",
        "A chemical solution",
        "A magnetic detector"
      ],
      correctAnswer: 1,
      explanation: "A probe that transmits high frequency vibrations is essential for conducting ultrasonic testing. The probe is passed over the surface of the component to detect internal defects."
    }
  ],
  shortAnswer: [
    {
      id: "ultrasonic-sa-1",
      question: "Explain the working principle of ultrasonic testing. How does it detect defects within a component?",
      expectedPoints: [
        "A probe transmits high frequency vibrations throughout the component",
        "The probe passes over the surface of the component",
        "Vibrations travel through the component material",
        "In perfect material, vibrations travel to the bottom",
        "Imperfections cause vibrations to be reflected",
        "Reflected vibrations do not travel to the bottom",
        "Results are displayed on a detection machine",
        "Detection machine shows reflection patterns indicating defect location"
      ],
      explanation: "Ultrasonic testing works by using a probe that transmits high frequency vibrations throughout the component as it passes over the surface. In a defect-free component, these vibrations travel all the way to the bottom. However, when the vibrations encounter any imperfections within the component, they are reflected back without travelling to the bottom. These reflections are captured and displayed on a detection machine, which allows technicians to identify the location and nature of subsurface defects."
    },
    {
      id: "ultrasonic-sa-2",
      question: "What are the main advantages of ultrasonic testing compared to other inspection methods? Why is it particularly valuable in industry?",
      expectedPoints: [
        "Detects subsurface defects not visible on the surface",
        "Non-destructive testing method - does not damage component",
        "Can inspect components while in service",
        "Provides immediate results on detection machine",
        "Can detect defects deep within materials",
        "Does not require disassembly in many cases",
        "More comprehensive than visual inspection",
        "Suitable for critical components where hidden defects could cause failure"
      ],
      explanation: "Ultrasonic testing offers several significant advantages over other inspection methods. Most importantly, it can detect subsurface defects that are completely invisible to visual inspection or surface testing methods. As a non-destructive technique, it allows components to be tested without causing any damage, meaning they can remain in service. The results are displayed immediately on a detection machine, providing quick feedback. This makes ultrasonic testing particularly valuable for inspecting critical components in industries like aerospace, nuclear, and manufacturing, where hidden internal defects could lead to catastrophic failures."
    },
    {
      id: "ultrasonic-sa-3",
      question: "Describe the typical applications of ultrasonic testing in industry. What types of defects can it identify and in what situations is it most commonly used?",
      expectedPoints: [
        "Used to detect subsurface defects in components",
        "Identifies cracks, voids, and inclusions within materials",
        "Detects porosity in castings and welds",
        "Used in weld inspection for hidden defects",
        "Applied in aerospace for critical component inspection",
        "Used in pressure vessel and pipeline inspection",
        "Monitors structural integrity of bridges and buildings",
        "Detects manufacturing defects like incomplete fusion",
        "Used in preventive maintenance programs",
        "Critical for safety-critical components"
      ],
      explanation: "Ultrasonic testing has widespread applications across many industries. It is commonly used to detect various types of subsurface defects including internal cracks, voids, inclusions, and porosity in castings and welds. The method is extensively applied in weld inspection, where hidden defects could compromise structural integrity. Industries such as aerospace, oil and gas, power generation, and construction rely on ultrasonic testing for inspecting critical components like pressure vessels, pipelines, aircraft structures, and bridge components. It is particularly valuable for preventive maintenance programs and ensuring the safety of components where failure could have serious consequences. The ability to detect manufacturing defects like incomplete fusion or delamination makes it an essential quality control tool."
    }
  ]
};
