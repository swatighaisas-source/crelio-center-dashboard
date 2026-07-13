import type { AgeRange, Parameter, ParameterCategory, ParameterType } from '@/types';
import { uid } from './id';

export type ParameterWithoutId = Omit<Parameter, 'id'>;

export const PARAMETER_TYPES: ParameterType[] = [
  'TestWithNormalRange',
  'TestWithDescriptiveRange',
  'TestWithAgeSpecificRange',
  'DescriptiveNoRanges',
  'ListField',
  'File',
  'Graph',
  'Image',
];

export const PARAMETER_CATEGORIES: ParameterCategory[] = [
  'Pathology',
  'Radiology',
  'Style',
];

export const PARAMETER_TYPE_LABELS: Record<ParameterType, string> = {
  TestWithNormalRange: 'Test With Normal Range',
  TestWithDescriptiveRange: 'Test With Descriptive Range',
  TestWithAgeSpecificRange: 'Test With Age Specific Range',
  DescriptiveNoRanges: 'Descriptive (No Ranges)',
  ListField: 'List Field',
  File: 'File',
  Graph: 'Graph',
  Image: 'Image',
};

/**
 * Per-field applicability: which parameter types expose a given field.
 * Fields not listed here are considered applicable to all parameter types
 * (e.g. common identifiers / flags).
 */
export const FIELD_APPLICABILITY: Record<string, Set<ParameterType>> = {
  unit: new Set<ParameterType>([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'ListField',
  ]),

  // Normal numeric ranges
  maleLowerRange: new Set(['TestWithNormalRange', 'TestWithDescriptiveRange', 'ListField']),
  maleUpperRange: new Set(['TestWithNormalRange', 'TestWithDescriptiveRange', 'ListField']),
  femaleLowerRange: new Set(['TestWithNormalRange', 'TestWithDescriptiveRange', 'ListField']),
  femaleUpperRange: new Set(['TestWithNormalRange', 'TestWithDescriptiveRange', 'ListField']),

  // Descriptive narratives alongside ranges
  descriptiveMale: new Set(['TestWithDescriptiveRange', 'ListField']),
  descriptiveFemale: new Set(['TestWithDescriptiveRange', 'ListField']),
  descriptiveMaleAdvanceEditor: new Set(['TestWithDescriptiveRange', 'ListField']),
  descriptiveFemaleAdvanceEditor: new Set(['TestWithDescriptiveRange', 'ListField']),

  // Age-specific fields (single compound editor that opens a modal)
  ageRanges: new Set(['TestWithAgeSpecificRange']),

  // Descriptive (no ranges)
  descriptive: new Set(['DescriptiveNoRanges']),
  descriptiveAdvanceEditor: new Set(['DescriptiveNoRanges']),
  breakLine: new Set(['DescriptiveNoRanges']),
  obxSegments: new Set(['DescriptiveNoRanges']),

  // List
  listValues: new Set(['ListField']),
  listMarkAsCritical: new Set(['ListField']),
  listHighlight: new Set(['ListField']),

  // Critical ranges
  criticalLowMale: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'ListField',
  ]),
  criticalHighMale: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'ListField',
  ]),
  criticalLowFemale: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'ListField',
  ]),
  criticalHighFemale: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'ListField',
  ]),

  // Calculation (available on most “test with …” types + descriptive no ranges)
  formulaPreset: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'DescriptiveNoRanges',
  ]),
  formula: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
    'DescriptiveNoRanges',
  ]),

  // Rerun method flags
  rerunAuto: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
  ]),
  rerunManual: new Set([
    'TestWithNormalRange',
    'TestWithDescriptiveRange',
    'TestWithAgeSpecificRange',
  ]),
};

/** Is `field` applicable to a parameter with `type`? */
export function isFieldApplicable(field: string, type: ParameterType): boolean {
  const set = FIELD_APPLICABILITY[field];
  if (!set) return true;
  return set.has(type);
}

export function defaultAgeRange(overrides: Partial<AgeRange> = {}): AgeRange {
  return {
    id: uid('age'),
    isDefault: false,
    ageUnit: 'Years',
    lowerAge: '',
    upperAge: '',
    lowerMale: '',
    upperMale: '',
    lowerFemale: '',
    upperFemale: '',
    descriptiveMale: '',
    descriptiveFemale: '',
    ...overrides,
  };
}

export function summariseAgeRanges(ranges: AgeRange[]): string {
  if (!ranges || ranges.length === 0) return '';
  const def = ranges.find((r) => r.isDefault) ?? ranges[0];
  const range = [def.lowerAge, def.upperAge].filter(Boolean).join('-');
  const parts = [`${ranges.length} row${ranges.length > 1 ? 's' : ''}`];
  if (range) parts.push(`default ${range} ${def.ageUnit}`);
  else parts.push(`default ${def.ageUnit}`);
  return parts.join(' · ');
}

export function defaultParameterRowWithoutId(): ParameterWithoutId {
  return {
    code: '',
    name: '',
    category: 'Pathology',
    type: 'TestWithNormalRange',

    unit: '',
    method: '',
    integrationCode: '',
    loincCode: '',
    dictionary: '',
    linkedParameters: '',

    maleLowerRange: '',
    maleUpperRange: '',
    femaleLowerRange: '',
    femaleUpperRange: '',

    defaultDescription: '',
    descriptiveMale: '',
    descriptiveFemale: '',
    descriptiveMaleAdvanceEditor: false,
    descriptiveFemaleAdvanceEditor: false,

    ageRanges: [],

    descriptive: '',
    descriptiveAdvanceEditor: false,
    breakLine: false,
    obxSegments: false,

    listValues: '',
    listMarkAsCritical: false,
    listHighlight: false,

    criticalLowMale: '',
    criticalHighMale: '',
    criticalLowFemale: '',
    criticalHighFemale: '',

    formulaPreset: '',
    formula: '',
    formulaMapping: '',

    rerunAuto: false,
    rerunManual: false,

    hideParameter: false,
    customizedParameter: false,
    highlightThisValue: false,
    underlineThisValue: false,
    optionalField: false,
    hasImpressions: false,
    hideParameterTrends: false,
    nonEditable: false,
    reportOnlyWhenPositive: false,

    autoApproval: false,
    autoApprovalLowerMale: '',
    autoApprovalUpperMale: '',
    autoApprovalLowerFemale: '',
    autoApprovalUpperFemale: '',

    disabled: false,
  };
}

/** Standard dictionary entries (would come from DB; static for the prototype). */
export const DICTIONARY_OPTIONS: string[] = [
  'CBC',
  'Lipid Profile',
  'Liver Function Test',
  'Kidney Function Test',
  'Thyroid Profile',
  'Diabetes Panel',
  'Electrolytes',
  'Urine Routine',
  'Coagulation Profile',
  'Iron Studies',
];

/** Formula presets available in the Formula dropdown. */
export const FORMULA_OPTIONS: string[] = [
  'A/G Ratio',
  'AIP (Anthropogenic Index of Plasma)',
  'Atheogenic Combined Index (ACI)',
  'Body fat calculation by using the US Navy qualification method - Female',
  'Body fat calculation by using the US Navy qualification method - Male',
  'CBC with 5-Part Differential (Comment Type Preset)',
  'CKD-EPI Creatinine-Cystatin Equation (2021)',
  'Clinical Notes For Toxicology Specimen Validity',
  'Creatinine Clearance',
  'EGFR (SI Unit) - CKD-EPI Method',
  'EGFR (SI Unit) - MDRD Method',
  'EGFR (Standard) - CKD-EPI Method (2019)',
  'EGFR (Standard) - CKD-EPI Method (2021)',
  'EGFR (Standard) - MDRD Method',
  'ESTIMATED GFR CAUCASIA',
  'Fatty Liver Index',
  'FIB 4',
  'Globulin',
  'IGF-1 Standard Score by Z-score method',
  'Indirect Bilirubin',
  'INR Value',
  'LDL Cholesterol',
  'LDL/HDL Ratio',
  'MCH',
  'MCHC',
  'Mean Corpuscular Volume',
  'Morphology',
  'Motility',
  'Osmolarity Urine',
  'Prothrombin Index',
  'Prothrombin Ratio',
  'Ratio (Decimal)',
  'Ratio (Percentage)',
  'Testosterone Free',
  'Total Cholesterol',
  'VLDL Cholesterol',
];

/**
 * Migrate a legacy parameter (old `defaults` / `flags` / `resultType` / etc.
 * shape) to the current Parameter interface. Also normalises any object that
 * may be missing fields from the new shape.
 */
// legacy shape fields we know about from earlier versions
type LegacyParameter = {
  id: string;
  code?: string;
  name?: string;
  displayName?: string;
  type?: string;
  resultType?: string;
  defaults?: {
    unit?: string;
    rangeType?: string;
    normalRange?: string;
    criticalLow?: number | null;
    criticalHigh?: number | null;
    precision?: number | null;
    allowedValues?: string[];
    formula?: string;
    interpretation?: string;
  };
  flags?: Record<string, unknown>;
  // Legacy flat age-range fields (prior to ageRanges[] refactor)
  ageUnit?: string;
  ageLower?: number | null;
  ageUpper?: number | null;
  ageLowerMale?: string;
  ageUpperMale?: string;
  ageLowerFemale?: string;
  ageUpperFemale?: string;
  ageDescriptiveMale?: string;
  ageDescriptiveFemale?: string;
  // Legacy free-text rerun instructions (replaced by rerunAuto/rerunManual flags)
  rerunInstructions?: string;
} & Partial<Parameter>;

function mapLegacyType(raw: string | undefined): ParameterType {
  if (!raw) return 'TestWithNormalRange';
  const s = raw.toLowerCase();
  if (PARAMETER_TYPES.includes(raw as ParameterType)) return raw as ParameterType;
  if (s.startsWith('numeric')) return 'TestWithNormalRange';
  if (s.startsWith('semi')) return 'TestWithNormalRange';
  if (s.startsWith('qual') || s.startsWith('list') || s.startsWith('cat')) return 'ListField';
  if (s.startsWith('text') || s.startsWith('narr') || s.startsWith('desc')) return 'DescriptiveNoRanges';
  if (s.startsWith('calc') || s.startsWith('form')) return 'DescriptiveNoRanges';
  return 'TestWithNormalRange';
}

function normaliseAgeUnit(v: unknown): AgeRange['ageUnit'] {
  const s = String(v ?? '').trim().toLowerCase();
  if (s.startsWith('day')) return 'Days';
  if (s.startsWith('mon')) return 'Months';
  return 'Years';
}

function hasLegacyAgeFields(raw: LegacyParameter): boolean {
  return (
    raw.ageLower != null ||
    raw.ageUpper != null ||
    !!raw.ageLowerMale ||
    !!raw.ageUpperMale ||
    !!raw.ageLowerFemale ||
    !!raw.ageUpperFemale ||
    !!raw.ageDescriptiveMale ||
    !!raw.ageDescriptiveFemale
  );
}

function splitRange(range: string | undefined): { lower: string; upper: string } {
  if (!range) return { lower: '', upper: '' };
  const parts = range.split(/[-–]/).map((s) => s.trim());
  return { lower: parts[0] ?? '', upper: parts[1] ?? '' };
}

export function mergeParameterFromPartial(
  raw: LegacyParameter & { id: string },
): Parameter {
  const base = defaultParameterRowWithoutId();
  const defaults = raw.defaults ?? {};
  const type = mapLegacyType(raw.type as string | undefined);
  const { lower, upper } = splitRange(defaults.normalRange);
  const legacyListValues = Array.isArray(defaults.allowedValues)
    ? defaults.allowedValues.join(', ')
    : '';

  const patched: Parameter = {
    ...base,
    id: raw.id,
    // Preserve library linkage across reloads (dropped previously, which
    // silently un-linked shared parameters on every page load).
    isTestLevel: raw.isTestLevel,
    sourceLibraryParameterId: raw.sourceLibraryParameterId,
    code: raw.code ?? base.code,
    name: raw.name ?? raw.displayName ?? base.name,
    category: (raw.category as ParameterCategory) ?? base.category,
    type,
    unit: (raw.unit as string) ?? defaults.unit ?? base.unit,
    method: (raw.method as string) ?? base.method,
    integrationCode: (raw.integrationCode as string) ?? base.integrationCode,
    loincCode: (raw.loincCode as string) ?? base.loincCode,
    dictionary: (raw.dictionary as string) ?? base.dictionary,
    linkedParameters: (raw.linkedParameters as string) ?? base.linkedParameters,

    maleLowerRange: (raw.maleLowerRange as string) ?? lower,
    maleUpperRange: (raw.maleUpperRange as string) ?? upper,
    femaleLowerRange: (raw.femaleLowerRange as string) ?? lower,
    femaleUpperRange: (raw.femaleUpperRange as string) ?? upper,

    descriptiveMale: (raw.descriptiveMale as string) ?? base.descriptiveMale,
    descriptiveFemale: (raw.descriptiveFemale as string) ?? base.descriptiveFemale,

    descriptive: (raw.descriptive as string) ?? defaults.interpretation ?? base.descriptive,

    listValues: (raw.listValues as string) ?? legacyListValues,

    criticalLowMale:
      (raw.criticalLowMale as string) ??
      (defaults.criticalLow != null ? String(defaults.criticalLow) : ''),
    criticalHighMale:
      (raw.criticalHighMale as string) ??
      (defaults.criticalHigh != null ? String(defaults.criticalHigh) : ''),

    formula: (raw.formula as string) ?? defaults.formula ?? base.formula,

    // Migrate legacy free-text rerun instructions → manual-rerun flag so
    // reviewers don't silently lose data.
    rerunAuto: typeof raw.rerunAuto === 'boolean' ? raw.rerunAuto : base.rerunAuto,
    rerunManual:
      typeof raw.rerunManual === 'boolean'
        ? raw.rerunManual
        : !!(raw.rerunInstructions && raw.rerunInstructions.trim().length > 0),

    ageRanges: Array.isArray(raw.ageRanges)
      ? raw.ageRanges.map((r) => ({ ...defaultAgeRange(), ...r }))
      : hasLegacyAgeFields(raw)
        ? [
            defaultAgeRange({
              isDefault: true,
              ageUnit: normaliseAgeUnit(raw.ageUnit),
              lowerAge: raw.ageLower != null ? String(raw.ageLower) : '',
              upperAge: raw.ageUpper != null ? String(raw.ageUpper) : '',
              lowerMale: raw.ageLowerMale ?? '',
              upperMale: raw.ageUpperMale ?? '',
              lowerFemale: raw.ageLowerFemale ?? '',
              upperFemale: raw.ageUpperFemale ?? '',
              descriptiveMale: raw.ageDescriptiveMale ?? '',
              descriptiveFemale: raw.ageDescriptiveFemale ?? '',
            }),
          ]
        : base.ageRanges,
  };

  // Finally fill in any remaining fields that weren't handled above
  const bag = patched as unknown as Record<string, unknown>;
  for (const k of Object.keys(base) as (keyof ParameterWithoutId)[]) {
    if (bag[k] === undefined) bag[k] = base[k];
  }
  return patched;
}
