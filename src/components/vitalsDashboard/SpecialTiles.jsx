// app/components/vitals/SpecialTiles.jsx
'use client';

import { Briefcase, Sun, Clock, Zap, Crown } from 'lucide-react';

/* ---------- helpers (descriptive names, no single-letter vars) ---------- */

function getNestedValueByPath(objectWithData, dotSeparatedPath) {
  return String(dotSeparatedPath)
    .split('.')
    .reduce(
      (currentValue, currentKey) =>
        currentValue !== undefined && currentValue !== null ? currentValue[currentKey] : undefined,
      objectWithData
    );
}

function normalizeFlexibleBoolean(anyPossibleBoolean) {
  if (typeof anyPossibleBoolean === 'boolean') return anyPossibleBoolean;
  if (typeof anyPossibleBoolean === 'number') return anyPossibleBoolean !== 0;
  if (typeof anyPossibleBoolean === 'string') {
    const lowered = anyPossibleBoolean.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(lowered)) return true;
    if (['false', '0', 'no', 'n'].includes(lowered)) return false;
  }
  return Boolean(anyPossibleBoolean);
}

function resolveBooleanFlagFromCandidatePaths(jobData, candidatePathsArray) {
  for (const candidatePath of candidatePathsArray) {
    const valueAtPath = getNestedValueByPath(jobData, candidatePath);
    if (valueAtPath !== undefined && valueAtPath !== null && normalizeFlexibleBoolean(valueAtPath)) {
      return true;
    }
  }
  return false;
}

/* One standardized tile */
function FeatureTile({ iconElement, titleText, subtitleText, backgroundClass, titleColorClass, subtitleColorClass }) {
  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${backgroundClass}`}>
      <div className="mb-1">{iconElement}</div>
      <p className={`text-sm font-semibold ${titleColorClass}`}>{titleText}</p>
      {subtitleText ? <p className={`text-xs ${subtitleColorClass}`}>{subtitleText}</p> : null}
    </div>
  );
}

/* ---------- component ---------- */
/**
 * Looks for these flags (true -> show tile):
 *  - job_metadata_v2._isGig
 *  - job_metadata_v2._isHybrid
 *  - job_metadata_v2._isTemp
 *  - job_metadata_v2._isImmediateStart
 *  - job_metadata_v2._isManagement
 *
 * Also: for Hybrid, we additionally infer from job_metadata_v2._workEnvironment:
 * if it includes both "home-office" and ("office" or "client-site"), we treat it as hybrid.
 */
export default function SpecialTiles({ jobData }) {
  const isGigFlag = resolveBooleanFlagFromCandidatePaths(jobData, [
    'job_metadata_v2._isGig',
    '_isGig',
    'isGig',
    'job_flags.isGig',
  ]);

  const isHybridFlagFromBooleans = resolveBooleanFlagFromCandidatePaths(jobData, [
    'job_metadata_v2._isHybrid',
    '_isHybrid',
    'isHybrid',
    'job_flags.isHybrid',
  ]);

  // Inference from work environment array (your JSON has this)
  const workEnvironmentArray =
    getNestedValueByPath(jobData, 'job_metadata_v2._workEnvironment') || [];
  const workEnvironmentValues = Array.isArray(workEnvironmentArray)
    ? workEnvironmentArray.map(String).map((s) => s.toLowerCase())
    : [];
  const isHybridFlagInferredFromEnvironment =
    workEnvironmentValues.includes('home-office') &&
    (workEnvironmentValues.includes('office') || workEnvironmentValues.includes('client-site'));

  const isHybridFlag = isHybridFlagFromBooleans || isHybridFlagInferredFromEnvironment;

  const isTemporaryFlag = resolveBooleanFlagFromCandidatePaths(jobData, [
    'job_metadata_v2._isTemp',
    '_isTemp',
    'isTemp',
    'isTemporary',
    'job_flags.isTemp',
    'job_flags.isTemporary',
  ]);

  const isImmediateStartFlag = resolveBooleanFlagFromCandidatePaths(jobData, [
    'job_metadata_v2._isImmediateStart',
    '_isImmediateStart',
    'isImmediateStart',
    'job_flags.isImmediateStart',
  ]);

  const isManagementFlag = resolveBooleanFlagFromCandidatePaths(jobData, [
    'job_metadata_v2._isManagement',
    '_isManagement',
    'isManagement',
    'job_flags.isManagement',
  ]);

  const renderedTiles = [];

  if (isGigFlag) {
    renderedTiles.push(
      <FeatureTile
        key="gig"
        iconElement={<Briefcase className="w-5 h-5 text-pink-600" aria-label="Gig Work" />}
        titleText="Gig Work"
        subtitleText="Flexible shifts"
        backgroundClass="bg-pink-50"
        titleColorClass="text-pink-700"
        subtitleColorClass="text-pink-600"
      />
    );
  }

  if (isHybridFlag) {
    renderedTiles.push(
      <FeatureTile
        key="hybrid"
        iconElement={<Sun className="w-5 h-5 text-amber-600" aria-label="Hybrid" />}
        titleText="Hybrid"
        subtitleText="Office + Home"
        backgroundClass="bg-amber-50"
        titleColorClass="text-amber-700"
        subtitleColorClass="text-amber-600"
      />
    );
  }

  if (isTemporaryFlag) {
    renderedTiles.push(
      <FeatureTile
        key="temporary"
        iconElement={<Clock className="w-5 h-5 text-yellow-600" aria-label="Temporary" />}
        titleText="Temporary"
        subtitleText="Short-term"
        backgroundClass="bg-yellow-50"
        titleColorClass="text-yellow-700"
        subtitleColorClass="text-yellow-600"
      />
    );
  }

  if (isImmediateStartFlag) {
    renderedTiles.push(
      <FeatureTile
        key="immediate-start"
        iconElement={<Zap className="w-5 h-5 text-indigo-600" aria-label="Immediate Start" />}
        titleText="Immediate Start"
        subtitleText="Start ASAP"
        backgroundClass="bg-indigo-50"
        titleColorClass="text-indigo-700"
        subtitleColorClass="text-indigo-600"
      />
    );
  }

  if (isManagementFlag) {
    renderedTiles.push(
      <FeatureTile
        key="management"
        iconElement={<Crown className="w-5 h-5 text-violet-600" aria-label="Management" />}
        titleText="Management"
        subtitleText="Lead a team"
        backgroundClass="bg-violet-50"
        titleColorClass="text-violet-700"
        subtitleColorClass="text-violet-600"
      />
    );
  }

  if (renderedTiles.length === 0) return null;
  return <>{renderedTiles}</>;
}
