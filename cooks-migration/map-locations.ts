interface LocationRow {
  admin0Pcode: string
  admin0Name_en: string
  admin1Pcode: string
  admin1Name_en: string
  admin2Pcode: string
  admin2Name_en: string
  admin3Pcode: string
  admin3Name_en: string
  admin4Pcode: string
  admin4Name_en: string
}

interface LocationEntry {
  name: string
  map: string | null
}

interface LocationMapping {
  code: string
  name: string
  level: number // 0=admin0, 1=admin1, etc.
  fullPath: string
}

// Calculate Levenshtein distance between two strings
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length
  const n = str2.length
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1, // substitution
        )
      }
    }
  }

  return dp[m][n]
}

// Normalize string for comparison
function normalize(str: string): string {
  return str
    .toUpperCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Calculate similarity score (0-1, where 1 is perfect match)
function similarityScore(str1: string, str2: string): number {
  const norm1 = normalize(str1)
  const norm2 = normalize(str2)

  // Exact match
  if (norm1 === norm2) return 1.0

  // Check if one contains the other
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return 0.95
  }

  const maxLen = Math.max(norm1.length, norm2.length)
  if (maxLen === 0) return 0

  const distance = levenshteinDistance(norm1, norm2)
  return 1 - distance / maxLen
}

// Parse CSV and build location mappings
function buildLocationMappings(csvContent: string): LocationMapping[] {
  const lines = csvContent.trim().split('\n')
  const mappings: LocationMapping[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    // Parse CSV line handling quoted fields
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current) // Add last field

    // Map fields to row object, padding with empty strings if needed
    while (fields.length < 10) fields.push('')

    const row: LocationRow = {
      admin0Pcode: fields[0] || '',
      admin0Name_en: fields[1] || '',
      admin1Pcode: fields[2] || '',
      admin1Name_en: fields[3] || '',
      admin2Pcode: fields[4] || '',
      admin2Name_en: fields[5] || '',
      admin3Pcode: fields[6] || '',
      admin3Name_en: fields[7] || '',
      admin4Pcode: fields[8] || '',
      admin4Name_en: fields[9] || '',
    }

    // Build hierarchy from this row, skipping N/A entries
    const hierarchy: Array<{ code: string; name: string; level: number }> = []

    if (
      row.admin0Pcode &&
      row.admin0Name_en &&
      row.admin0Name_en.trim().toUpperCase() !== 'N/A'
    ) {
      hierarchy.push({
        code: row.admin0Pcode.trim(),
        name: row.admin0Name_en.trim(),
        level: 0,
      })
    }
    if (
      row.admin1Pcode &&
      row.admin1Name_en &&
      row.admin1Name_en.trim().toUpperCase() !== 'N/A'
    ) {
      hierarchy.push({
        code: row.admin1Pcode.trim(),
        name: row.admin1Name_en.trim(),
        level: 1,
      })
    }
    if (
      row.admin2Pcode &&
      row.admin2Name_en &&
      row.admin2Name_en.trim().toUpperCase() !== 'N/A'
    ) {
      hierarchy.push({
        code: row.admin2Pcode.trim(),
        name: row.admin2Name_en.trim(),
        level: 2,
      })
    }
    if (
      row.admin3Pcode &&
      row.admin3Name_en &&
      row.admin3Name_en.trim().toUpperCase() !== 'N/A'
    ) {
      hierarchy.push({
        code: row.admin3Pcode.trim(),
        name: row.admin3Name_en.trim(),
        level: 3,
      })
    }
    if (
      row.admin4Pcode &&
      row.admin4Name_en &&
      row.admin4Name_en.trim().toUpperCase() !== 'N/A'
    ) {
      hierarchy.push({
        code: row.admin4Pcode.trim(),
        name: row.admin4Name_en.trim(),
        level: 4,
      })
    }

    // Create mappings for individual location names at each level
    for (const item of hierarchy) {
      mappings.push({
        code: item.code,
        name: item.name,
        level: item.level,
        fullPath: hierarchy
          .slice(0, item.level + 1)
          .map((h) => h.name)
          .join(' > '),
      })
    }

    // Create mappings for combinations (to handle "Matavera Rarotonga" style inputs)
    // Map to the deepest level mentioned in the combination
    for (let startIdx = 0; startIdx < hierarchy.length; startIdx++) {
      for (let endIdx = startIdx + 1; endIdx <= hierarchy.length; endIdx++) {
        const slice = hierarchy.slice(startIdx, endIdx)
        const combinedName = slice.map((h) => h.name).join(' ')
        const reversedName = slice
          .map((h) => h.name)
          .reverse()
          .join(' ')

        // The code should be from the deepest (last) item in the slice
        const deepestItem = slice[slice.length - 1]

        mappings.push({
          code: deepestItem.code,
          name: combinedName,
          level: deepestItem.level,
          fullPath: hierarchy
            .slice(0, deepestItem.level + 1)
            .map((h) => h.name)
            .join(' > '),
        })

        // Also add reversed version
        if (combinedName !== reversedName) {
          mappings.push({
            code: deepestItem.code,
            name: reversedName,
            level: deepestItem.level,
            fullPath: hierarchy
              .slice(0, deepestItem.level + 1)
              .map((h) => h.name)
              .join(' > '),
          })
        }
      }
    }
  }

  return mappings
}

// Find best matching location
function findBestMatch(
  searchName: string,
  mappings: LocationMapping[],
  threshold: number = 0.7,
): { code: string; score: number; matchedName: string; level: number } | null {
  let bestMatch: {
    code: string
    score: number
    matchedName: string
    level: number
    lengthDiff: number
  } | null = null

  for (const mapping of mappings) {
    const score = similarityScore(searchName, mapping.name)

    if (score >= threshold) {
      const lengthDiff = Math.abs(
        normalize(searchName).length - normalize(mapping.name).length,
      )

      // Prefer matches with:
      // 1. Higher similarity scores (primary criterion)
      // 2. Closer length to input (secondary criterion - prevents matching to overly long combinations)
      // 3. Deeper levels if scores and lengths are similar (tertiary criterion)
      if (!bestMatch) {
        bestMatch = {
          code: mapping.code,
          score: score,
          matchedName: mapping.name,
          level: mapping.level,
          lengthDiff: lengthDiff,
        }
      } else {
        const scoreDiff = score - bestMatch.score
        const lengthDiffChange = lengthDiff - bestMatch.lengthDiff

        // Better if score is significantly better (>0.05 difference)
        if (scoreDiff > 0.05) {
          bestMatch = {
            code: mapping.code,
            score: score,
            matchedName: mapping.name,
            level: mapping.level,
            lengthDiff: lengthDiff,
          }
        }
        // If scores are very close (within 0.05), prefer shorter length difference
        else if (Math.abs(scoreDiff) <= 0.05 && lengthDiffChange < -5) {
          bestMatch = {
            code: mapping.code,
            score: score,
            matchedName: mapping.name,
            level: mapping.level,
            lengthDiff: lengthDiff,
          }
        }
        // If scores and lengths are similar, prefer deeper level
        else if (
          Math.abs(scoreDiff) <= 0.05 &&
          Math.abs(lengthDiffChange) <= 5 &&
          mapping.level > bestMatch.level
        ) {
          bestMatch = {
            code: mapping.code,
            score: score,
            matchedName: mapping.name,
            level: mapping.level,
            lengthDiff: lengthDiff,
          }
        }
      }
    }
  }

  return bestMatch
    ? {
        code: bestMatch.code,
        score: bestMatch.score,
        matchedName: bestMatch.matchedName,
        level: bestMatch.level,
      }
    : null
}

// Main function
async function mapLocations() {
  console.log('Loading CSV file...')
  const csvPath =
    '/home/baz/code/openCRVS/ckopencrvs/src/data-seeding/locations/source/locations.csv'
  const csvContent = await Deno.readTextFile(csvPath)

  console.log('Building location mappings...')
  const mappings = buildLocationMappings(csvContent)
  console.log(`Built ${mappings.length} location mappings`)

  console.log('Loading JSON file...')
  const jsonPath = 'cooks-migration/formData/locations.json'
  const jsonContent = await Deno.readTextFile(jsonPath)
  const locations: LocationEntry[] = JSON.parse(jsonContent)
  console.log(`Processing ${locations.length} location entries`)

  let matchedCount = 0
  let unmatchedCount = 0
  const unmatchedNames: string[] = []

  console.log('\nProcessing locations...')
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i]

    if (i % 1000 === 0) {
      console.log(`Progress: ${i}/${locations.length}`)
    }

    const match = findBestMatch(location.name, mappings)

    if (match) {
      location.map = match.code
      matchedCount++

      // Log first 30 matches and some lower-confidence matches for verification
      if (i < 30 || (match.score < 0.85 && matchedCount < 100)) {
        console.log(
          `  "${location.name}" -> ${match.code} (${match.matchedName}, level: ${match.level}, score: ${match.score.toFixed(2)})`,
        )
      }
    } else {
      location.map = null
      unmatchedCount++
      if (unmatchedNames.length < 50) {
        unmatchedNames.push(location.name)
      }
    }
  }

  console.log('\n=== Results ===')
  console.log(`Total entries: ${locations.length}`)
  console.log(
    `Matched: ${matchedCount} (${((matchedCount / locations.length) * 100).toFixed(1)}%)`,
  )
  console.log(
    `Unmatched: ${unmatchedCount} (${((unmatchedCount / locations.length) * 100).toFixed(1)}%)`,
  )

  if (unmatchedNames.length > 0) {
    console.log('\nSample unmatched names:')
    unmatchedNames.slice(0, 20).forEach((name) => console.log(`  - ${name}`))
  }

  console.log('\nSaving updated JSON...')
  await Deno.writeTextFile(jsonPath, JSON.stringify(locations, null, 2))

  console.log('Done! Updated file saved to:', jsonPath)
}

// Run the script
if (import.meta.main) {
  await mapLocations()
}
