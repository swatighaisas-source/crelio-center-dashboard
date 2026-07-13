import type { AppState, Parameter, TestParameterMapping } from '@/types';
import { defaultTestRowWithoutId } from './testDefaults';
import { defaultAgeRange, defaultParameterRowWithoutId } from './parameterDefaults';
import { uid } from './id';

export function buildSeed(): AppState {
  const departments = [
    { id: uid('dep'), name: 'Biochemistry' },
    { id: uid('dep'), name: 'Hematology' },
    { id: uid('dep'), name: 'Microbiology' },
    { id: uid('dep'), name: 'Radiology' },
    { id: uid('dep'), name: 'Pathology' },
  ];
  const sampleTypes = [
    { id: uid('smp'), name: 'Serum' },
    { id: uid('smp'), name: 'Plasma' },
    { id: uid('smp'), name: 'Whole Blood' },
    { id: uid('smp'), name: 'Urine' },
    { id: uid('smp'), name: 'Swab' },
  ];

  const [biochem, hema, , , patho] = departments;
  const [serum, , wholeBlood, urine] = sampleTypes;

  const tests = [
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'BIO_GLU_F',
      name: 'Glucose Fasting',
      shortName: 'Glu F',
      departmentId: biochem.id,
      sampleTypeId: serum.id,
      category: 'Diabetes',
      testType: 'Pathology',
      validationStatus: 'Verified' as const,
      validatedActive: true,
      tat: '2h',
      defaultPrice: 120,
      genderBasedTest: 'All',
      remarks: '',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'BIO_LFT',
      name: 'Liver Function Test',
      shortName: 'LFT',
      departmentId: biochem.id,
      sampleTypeId: serum.id,
      category: 'Liver',
      testType: 'Pathology',
      validationStatus: 'Verified' as const,
      validatedActive: true,
      tat: '4h',
      defaultPrice: 650,
      genderBasedTest: 'All',
      remarks: '',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'HEM_CBC',
      name: 'Complete Blood Count',
      shortName: 'CBC',
      departmentId: hema.id,
      sampleTypeId: wholeBlood.id,
      category: 'Hematology',
      testType: 'Pathology',
      validationStatus: 'Verified' as const,
      validatedActive: true,
      tat: '2h',
      defaultPrice: 350,
      genderBasedTest: 'All',
      remarks: '',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'PATH_URE',
      name: 'Urine Routine',
      shortName: 'Urine R',
      departmentId: patho.id,
      sampleTypeId: urine.id,
      category: 'Urine',
      testType: 'Pathology',
      validationStatus: 'Unverified' as const,
      validatedActive: true,
      tat: '1h',
      defaultPrice: 150,
      genderBasedTest: 'All',
      remarks: '',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'BIO_DIA_PAN',
      name: 'Diabetes Panel',
      shortName: 'Dia Pan',
      departmentId: biochem.id,
      sampleTypeId: serum.id,
      category: 'Diabetes',
      testType: 'Pathology',
      validationStatus: 'Verified' as const,
      validatedActive: true,
      tat: '4h',
      defaultPrice: 450,
      genderBasedTest: 'All',
      remarks: '',
    },
    // --- "Legacy" tests below carry independent (non-library) parameters. ---
    // Their parameters intentionally use abbreviations / alternate spellings
    // so the Non-Library Parameters cleanup workspace has something to group.
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'HEM_CBC_EXP',
      name: 'CBC Express (Legacy)',
      shortName: 'CBC Exp',
      departmentId: hema.id,
      sampleTypeId: wholeBlood.id,
      category: 'Hematology',
      testType: 'Pathology',
      validationStatus: 'Unverified' as const,
      validatedActive: true,
      tat: '1h',
      defaultPrice: 300,
      genderBasedTest: 'All',
      remarks: 'Imported from legacy device interface',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'HEM_HEMOGRAM',
      name: 'Hemogram Report (Legacy)',
      shortName: 'Hemogram',
      departmentId: hema.id,
      sampleTypeId: wholeBlood.id,
      category: 'Hematology',
      testType: 'Pathology',
      validationStatus: 'Unverified' as const,
      validatedActive: true,
      tat: '2h',
      defaultPrice: 320,
      genderBasedTest: 'All',
      remarks: 'Imported from legacy device interface',
    },
    {
      id: uid('tst'),
      ...defaultTestRowWithoutId(),
      code: 'BIO_THY_LEG',
      name: 'Thyroid Screen (Legacy)',
      shortName: 'Thy Screen',
      departmentId: biochem.id,
      sampleTypeId: serum.id,
      category: 'Endocrinology',
      testType: 'Pathology',
      validationStatus: 'Unverified' as const,
      validatedActive: true,
      tat: '6h',
      defaultPrice: 500,
      genderBasedTest: 'All',
      remarks: 'Imported from legacy device interface',
    },
  ];

  const parameters = [
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_GLU',
      name: 'Glucose',
      category: 'Pathology' as const,
      type: 'TestWithNormalRange' as const,
      unit: 'mg/dL',
      maleLowerRange: '70',
      maleUpperRange: '100',
      femaleLowerRange: '70',
      femaleUpperRange: '100',
      criticalLowMale: '40',
      criticalHighMale: '400',
      criticalLowFemale: '40',
      criticalHighFemale: '400',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_HB',
      name: 'Hemoglobin',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: 'g/dL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Days',
          lowerAge: '0',
          upperAge: '30',
          lowerMale: '14.0',
          upperMale: '22.0',
          lowerFemale: '14.0',
          upperFemale: '22.0',
          descriptiveMale: '14.0 - 22.0',
          descriptiveFemale: '14.0 - 22.0',
        }),
        defaultAgeRange({
          ageUnit: 'Months',
          lowerAge: '1',
          upperAge: '12',
          lowerMale: '11.5',
          upperMale: '16.5',
          lowerFemale: '11.5',
          upperFemale: '16.5',
          descriptiveMale: '11.5 - 16.5',
          descriptiveFemale: '11.5 - 16.5',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '12',
          upperAge: '101',
          lowerMale: '13.0',
          upperMale: '17.0',
          lowerFemale: '12.0',
          upperFemale: '15.0',
          descriptiveMale: '13.0 - 17.0',
          descriptiveFemale: '12.0 - 15.0',
        }),
      ],
      criticalLowMale: '7',
      criticalHighMale: '20',
      criticalLowFemale: '7',
      criticalHighFemale: '20',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_WBC',
      name: 'WBC Count',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: '10^3/µL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Days',
          lowerAge: '0',
          upperAge: '30',
          lowerMale: '9.0',
          upperMale: '30.0',
          lowerFemale: '9.0',
          upperFemale: '30.0',
        }),
        defaultAgeRange({
          ageUnit: 'Months',
          lowerAge: '1',
          upperAge: '24',
          lowerMale: '6.0',
          upperMale: '17.5',
          lowerFemale: '6.0',
          upperFemale: '17.5',
        }),
        defaultAgeRange({
          ageUnit: 'Years',
          lowerAge: '2',
          upperAge: '12',
          lowerMale: '5.0',
          upperMale: '14.5',
          lowerFemale: '5.0',
          upperFemale: '14.5',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '12',
          upperAge: '101',
          lowerMale: '4.0',
          upperMale: '11.0',
          lowerFemale: '4.0',
          upperFemale: '11.0',
        }),
      ],
      criticalLowMale: '2',
      criticalHighMale: '30',
      criticalLowFemale: '2',
      criticalHighFemale: '30',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_MCV',
      name: 'MCV',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: 'fL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Months',
          lowerAge: '0',
          upperAge: '6',
          lowerMale: '88',
          upperMale: '123',
          lowerFemale: '88',
          upperFemale: '123',
        }),
        defaultAgeRange({
          ageUnit: 'Years',
          lowerAge: '0',
          upperAge: '12',
          lowerMale: '76',
          upperMale: '90',
          lowerFemale: '76',
          upperFemale: '90',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '12',
          upperAge: '101',
          lowerMale: '80',
          upperMale: '100',
          lowerFemale: '80',
          upperFemale: '100',
        }),
      ],
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_PLT',
      name: 'Platelet Count',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: '10^3/µL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Days',
          lowerAge: '0',
          upperAge: '30',
          lowerMale: '150',
          upperMale: '450',
          lowerFemale: '150',
          upperFemale: '450',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '0',
          upperAge: '101',
          lowerMale: '150',
          upperMale: '410',
          lowerFemale: '150',
          upperFemale: '410',
        }),
      ],
      criticalLowMale: '20',
      criticalHighMale: '1000',
      criticalLowFemale: '20',
      criticalHighFemale: '1000',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_CREAT',
      name: 'Creatinine',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: 'mg/dL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Years',
          lowerAge: '0',
          upperAge: '18',
          lowerMale: '0.3',
          upperMale: '0.7',
          lowerFemale: '0.3',
          upperFemale: '0.7',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '18',
          upperAge: '101',
          lowerMale: '0.7',
          upperMale: '1.3',
          lowerFemale: '0.6',
          upperFemale: '1.1',
        }),
      ],
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_TSH',
      name: 'TSH',
      category: 'Pathology' as const,
      type: 'TestWithAgeSpecificRange' as const,
      unit: 'µIU/mL',
      ageRanges: [
        defaultAgeRange({
          ageUnit: 'Days',
          lowerAge: '0',
          upperAge: '4',
          lowerMale: '1.0',
          upperMale: '39.0',
          lowerFemale: '1.0',
          upperFemale: '39.0',
        }),
        defaultAgeRange({
          ageUnit: 'Months',
          lowerAge: '0',
          upperAge: '12',
          lowerMale: '1.7',
          upperMale: '9.1',
          lowerFemale: '1.7',
          upperFemale: '9.1',
        }),
        defaultAgeRange({
          ageUnit: 'Years',
          lowerAge: '1',
          upperAge: '18',
          lowerMale: '0.7',
          upperMale: '5.7',
          lowerFemale: '0.7',
          upperFemale: '5.7',
        }),
        defaultAgeRange({
          isDefault: true,
          ageUnit: 'Years',
          lowerAge: '18',
          upperAge: '101',
          lowerMale: '0.4',
          upperMale: '4.2',
          lowerFemale: '0.4',
          upperFemale: '4.2',
        }),
      ],
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_UR_COL',
      name: 'Urine Colour',
      category: 'Pathology' as const,
      type: 'ListField' as const,
      listValues: 'Pale Yellow, Yellow, Amber, Red, Colourless',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_UR_PH',
      name: 'Urine pH',
      category: 'Pathology' as const,
      type: 'TestWithNormalRange' as const,
      maleLowerRange: '4.6',
      maleUpperRange: '8.0',
      femaleLowerRange: '4.6',
      femaleUpperRange: '8.0',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_AST',
      name: 'AST (SGOT)',
      category: 'Pathology' as const,
      type: 'TestWithNormalRange' as const,
      unit: 'U/L',
      maleLowerRange: '5',
      maleUpperRange: '40',
      femaleLowerRange: '5',
      femaleUpperRange: '40',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_ALT',
      name: 'ALT (SGPT)',
      category: 'Pathology' as const,
      type: 'TestWithNormalRange' as const,
      unit: 'U/L',
      maleLowerRange: '7',
      maleUpperRange: '56',
      femaleLowerRange: '7',
      femaleUpperRange: '56',
    },
    {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: 'PR_NOTES',
      name: 'Impression',
      category: 'Pathology' as const,
      type: 'DescriptiveNoRanges' as const,
      descriptive: 'Clinical impression / narrative.',
    },
  ];

  const [pGlu, pHb, pWbc, pMcv, pPlt, , pTsh, pUrCol, pUrPh, pAst, pAlt] = parameters;

  const [tGlu, tLft, tCbc, tUrine, tDiaPan, tCbcExp, tHemogram, tThyLeg] = tests;

  // Every test parameter is modeled as a test-level child row that links back
  // to its library source (`sourceLibraryParameterId`). This matches what the
  // "Assign Parameters" flow produces at runtime and keeps the Report
  // Parameters editor on a uniform "linked vs independent" model.
  const testChildren: Parameter[] = [];
  const mappings: TestParameterMapping[] = [];

  const plan: Array<{
    testId: string;
    libraryParamId: string;
    required: boolean;
  }> = [
    // Glucose Fasting — Glucose (shared library parameter)
    { testId: tGlu.id, libraryParamId: pGlu.id, required: true },
    // Liver Function Test — AST + ALT
    { testId: tLft.id, libraryParamId: pAst.id, required: true },
    { testId: tLft.id, libraryParamId: pAlt.id, required: true },
    // Complete Blood Count — Hemoglobin + WBC + MCV + Platelet
    { testId: tCbc.id, libraryParamId: pHb.id, required: true },
    { testId: tCbc.id, libraryParamId: pWbc.id, required: true },
    { testId: tCbc.id, libraryParamId: pMcv.id, required: false },
    { testId: tCbc.id, libraryParamId: pPlt.id, required: true },
    // Urine Routine — Colour + pH
    { testId: tUrine.id, libraryParamId: pUrCol.id, required: true },
    { testId: tUrine.id, libraryParamId: pUrPh.id, required: true },
    // Diabetes Panel — Glucose (SHARED with Glucose Fasting) + TSH
    { testId: tDiaPan.id, libraryParamId: pGlu.id, required: true },
    { testId: tDiaPan.id, libraryParamId: pTsh.id, required: true },
  ];

  const seqByTest: Record<string, number> = {};
  const paramById = new Map(parameters.map((p) => [p.id, p] as const));

  for (const entry of plan) {
    const lib = paramById.get(entry.libraryParamId);
    if (!lib) continue;
    const childId = uid('par');
    const child: Parameter = {
      ...lib,
      id: childId,
      isTestLevel: true,
      sourceLibraryParameterId: lib.id,
    };
    testChildren.push(child);
    const nextSeq = (seqByTest[entry.testId] ?? 0) + 1;
    seqByTest[entry.testId] = nextSeq;
    mappings.push({
      id: uid('map'),
      testId: entry.testId,
      parameterId: childId,
      sequence: nextSeq,
      isHeader: false,
      printable: true,
      required: entry.required,
      overrides: {},
    });
  }

  // Add one independent (non-library) test parameter on CBC so the Report
  // Parameters UI can demonstrate the "Independent" state alongside linked rows.
  const independentParam: Parameter = {
    id: uid('par'),
    ...defaultParameterRowWithoutId(),
    code: 'CBC_NOTE',
    name: 'CBC Clinical Note',
    category: 'Pathology',
    type: 'DescriptiveNoRanges',
    descriptive: 'Test-specific note. Not from library.',
    isTestLevel: true,
  };
  testChildren.push(independentParam);
  const cbcNextSeq = (seqByTest[tCbc.id] ?? 0) + 1;
  mappings.push({
    id: uid('map'),
    testId: tCbc.id,
    parameterId: independentParam.id,
    sequence: cbcNextSeq,
    isHeader: false,
    printable: true,
    required: false,
    overrides: {},
  });

  // ----------------------------------------------------------------
  // Independent (non-library) parameters on the "legacy" tests. These
  // intentionally use abbreviations/alternate spellings so the Non-Library
  // Parameters cleanup workspace has realistic duplicate groups to surface.
  //   - "Hemoglobin" group → HGB, Hb, Haemoglobin (3 across 2 tests)
  //   - "WBC count" group → WBC, WBC count (2 across 2 tests)
  //   - "Platelet count" group → PLT, Platelets (2 across 2 tests),
  //     also matches existing library "Platelet Count".
  //   - "Glucose" group → Glu (matches existing library "Glucose").
  //   - "TSH" group → TSH (matches existing library "TSH").
  //   - Orphan singletons: T3, T4, MCHC — no library match, good
  //     candidates for "Add to Library".
  // ----------------------------------------------------------------
  const legacyIndependents: Array<{
    testId: string;
    code: string;
    name: string;
    unit: string;
    type: Parameter['type'];
    maleLowerRange?: string;
    maleUpperRange?: string;
    femaleLowerRange?: string;
    femaleUpperRange?: string;
  }> = [
    // CBC Express (Legacy)
    {
      testId: tCbcExp.id,
      code: 'HGB',
      name: 'HGB',
      unit: 'g/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '13',
      maleUpperRange: '17',
      femaleLowerRange: '12',
      femaleUpperRange: '15',
    },
    {
      testId: tCbcExp.id,
      code: 'WBC',
      name: 'WBC',
      unit: '10^3/µL',
      type: 'TestWithNormalRange',
      maleLowerRange: '4',
      maleUpperRange: '11',
      femaleLowerRange: '4',
      femaleUpperRange: '11',
    },
    {
      testId: tCbcExp.id,
      code: 'PLT',
      name: 'PLT',
      unit: '10^3/µL',
      type: 'TestWithNormalRange',
      maleLowerRange: '150',
      maleUpperRange: '410',
      femaleLowerRange: '150',
      femaleUpperRange: '410',
    },
    {
      testId: tCbcExp.id,
      code: 'MCHC',
      name: 'MCHC',
      unit: 'g/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '32',
      maleUpperRange: '36',
      femaleLowerRange: '32',
      femaleUpperRange: '36',
    },
    // Hemogram Report (Legacy)
    {
      testId: tHemogram.id,
      code: 'HB',
      name: 'Hb',
      unit: 'g/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '13.5',
      maleUpperRange: '17.5',
      femaleLowerRange: '12',
      femaleUpperRange: '15.5',
    },
    {
      testId: tHemogram.id,
      code: 'HGB_ALT',
      name: 'Haemoglobin',
      unit: 'g/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '13',
      maleUpperRange: '17',
      femaleLowerRange: '12',
      femaleUpperRange: '15',
    },
    {
      testId: tHemogram.id,
      code: 'WBC_CT',
      name: 'WBC count',
      unit: '10^3/µL',
      type: 'TestWithNormalRange',
      maleLowerRange: '4',
      maleUpperRange: '10',
      femaleLowerRange: '4',
      femaleUpperRange: '10',
    },
    {
      testId: tHemogram.id,
      code: 'PLTS',
      name: 'Platelets',
      unit: '10^3/µL',
      type: 'TestWithNormalRange',
      maleLowerRange: '150',
      maleUpperRange: '450',
      femaleLowerRange: '150',
      femaleUpperRange: '450',
    },
    // Thyroid Screen (Legacy)
    {
      testId: tThyLeg.id,
      code: 'TSH_LEG',
      name: 'TSH',
      unit: 'mIU/L',
      type: 'TestWithNormalRange',
      maleLowerRange: '0.4',
      maleUpperRange: '4.0',
      femaleLowerRange: '0.4',
      femaleUpperRange: '4.0',
    },
    {
      testId: tThyLeg.id,
      code: 'T3',
      name: 'T3',
      unit: 'ng/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '80',
      maleUpperRange: '200',
      femaleLowerRange: '80',
      femaleUpperRange: '200',
    },
    {
      testId: tThyLeg.id,
      code: 'T4',
      name: 'T4',
      unit: 'µg/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '5',
      maleUpperRange: '12',
      femaleLowerRange: '5',
      femaleUpperRange: '12',
    },
    // Also add a "Glu" independent to Glucose Fasting so the Glucose group
    // shows how an independent row can match an existing library parameter.
    {
      testId: tGlu.id,
      code: 'GLU',
      name: 'Glu',
      unit: 'mg/dL',
      type: 'TestWithNormalRange',
      maleLowerRange: '70',
      maleUpperRange: '110',
      femaleLowerRange: '70',
      femaleUpperRange: '110',
    },
  ];

  for (const p of legacyIndependents) {
    const paramRow: Parameter = {
      id: uid('par'),
      ...defaultParameterRowWithoutId(),
      code: p.code,
      name: p.name,
      category: 'Pathology',
      type: p.type,
      unit: p.unit,
      maleLowerRange: p.maleLowerRange ?? '',
      maleUpperRange: p.maleUpperRange ?? '',
      femaleLowerRange: p.femaleLowerRange ?? '',
      femaleUpperRange: p.femaleUpperRange ?? '',
      isTestLevel: true,
    };
    testChildren.push(paramRow);
    const nextSeq = (seqByTest[p.testId] ?? 0) + 1;
    seqByTest[p.testId] = nextSeq;
    mappings.push({
      id: uid('map'),
      testId: p.testId,
      parameterId: paramRow.id,
      sequence: nextSeq,
      isHeader: false,
      printable: true,
      required: false,
      overrides: {},
    });
  }

  return {
    tests,
    parameters: [...parameters, ...testChildren],
    departments,
    sampleTypes,
    mappings,
  };
}
