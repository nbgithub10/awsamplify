// Studocu Quiz Data - Engineering Materials
// Combines all topic modules into a single data structure

import { metalsData } from './metals.js';
import { polymersElastomersData } from './polymers-elastomers.js';
import { ceramicsData } from './ceramics.js';
import { compositesData } from './composites.js';
import { civilTestingData } from './civil-testing.js';
import { crackTheoryData } from './crack-theory.js';
import { corrosionData } from './corrosion.js';
import { recyclabilityData } from './recyclability.js';
import { hardnessImpactTestingData } from './hardness-impact-testing.js';
import { visualRadiographicTestingData } from './visual-radiographic-testing.js';
import { ultrasonicTestingData } from './ultrasonic-testing.js';
import { advancedCeramicsData } from './advanced-ceramics.js';
import { advancedCompositesData } from './advanced-composites.js';
import { glassSemiconductorsData } from './glass-semiconductors.js';
import { heatTreatmentData } from './heat-treatment.js';
import { ferrousManufacturingData } from './ferrous-manufacturing.js';
import { nonFerrousManufacturingData } from './non-ferrous-manufacturing.js';
import { polymerManufacturingData } from './polymer-manufacturing.js';
import { aeronauticalEngineeringData } from './aeronautical-engineering.js';
import { telecommunicationsData } from './telecommunications.js';

export const studocuQuizData = {
  title: "Studocu - Engineering Materials",
  sections: {
    metals: metalsData,
    polymersElastomers: polymersElastomersData,
    ceramics: ceramicsData,
    composites: compositesData,
    civilTesting: civilTestingData,
    crackTheory: crackTheoryData,
    corrosion: corrosionData,
    recyclability: recyclabilityData,
    hardnessImpactTesting: hardnessImpactTestingData,
    visualRadiographicTesting: visualRadiographicTestingData,
    ultrasonicTesting: ultrasonicTestingData,
    advancedCeramics: advancedCeramicsData,
    advancedComposites: advancedCompositesData,
    glassSemiconductors: glassSemiconductorsData,
    heatTreatment: heatTreatmentData,
    ferrousManufacturing: ferrousManufacturingData,
    nonFerrousManufacturing: nonFerrousManufacturingData,
    polymerManufacturing: polymerManufacturingData,
    aeronauticalEngineering: aeronauticalEngineeringData,
    telecommunications: telecommunicationsData,
  }
};

// Export individual topics for direct access if needed
export {
  metalsData,
  polymersElastomersData,
  ceramicsData,
  compositesData,
  civilTestingData,
  crackTheoryData,
  corrosionData,
  recyclabilityData,
  hardnessImpactTestingData,
  visualRadiographicTestingData,
  ultrasonicTestingData,
  advancedCeramicsData,
  advancedCompositesData,
  glassSemiconductorsData,
  heatTreatmentData,
  ferrousManufacturingData,
  nonFerrousManufacturingData,
  polymerManufacturingData,
  aeronauticalEngineeringData,
  telecommunicationsData,
};
