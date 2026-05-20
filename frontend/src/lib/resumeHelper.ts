/**
 * Helper utilities for rendering high-fidelity, polished resumes.
 */

/**
 * Splits experience and project descriptions into clean bullet points.
 * Handles newlines, explicit list markers, and gracefully splits paragraph
 * blocks by sentence boundaries without breaking technical abbreviations.
 */
export function parseBulletPoints(text?: string): string[] {
  if (!text) return [];

  let items = text.split(/\r?\n/);

  if (items.length === 1) {
    const inlineMarkers = ['\u2022', '\u25AA', '\u25E6', '\u25A0'];
    let foundMarker = false;

    for (const marker of inlineMarkers) {
      if (text.includes(marker)) {
        items = text.split(marker);
        foundMarker = true;
        break;
      }
    }

    if (!foundMarker) {
      if (text.includes(' - ')) {
        items = text.split(' - ');
      } else if (text.includes(' * ')) {
        items = text.split(' * ');
      } else {
        items = text.split(/\.(?=\s+[A-Z])/);
        items = items.map((item, idx) => {
          let clean = item.trim();
          if (clean && idx < items.length - 1 && !clean.endsWith('.')) {
            clean += '.';
          }
          return clean;
        });
      }
    }
  }

  return items
    .map(item => {
      let cleaned = item.trim();
      cleaned = cleaned.replace(/^[\u2022\u25AA\u25E6\u25A0*+\-]\s*/, '');
      cleaned = cleaned.replace(/^([0-9]+|[a-zA-Z])[\.)]\s*/, '');
      return cleaned.trim();
    })
    .filter(item => item.length > 0);
}

/**
 * Strips protocol and standard domains to display clean contact handles.
 */
export function cleanLinkedin(url?: string): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '')
    .replace(/\/$/, '');
}

export function cleanGithub(url?: string): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
    .replace(/\/$/, '');
}

export function cleanPortfolio(url?: string): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/i, '')
    .replace(/\/$/, '');
}

/**
 * Filters out empty or blank experience entries.
 */
export function filterExperience(
  expList?: Array<{ company?: string; role?: string; duration?: string; description?: string }>
) {
  if (!expList) return [];
  return expList.filter(
    exp => exp.company?.trim() || exp.role?.trim() || exp.duration?.trim() || exp.description?.trim()
  );
}

/**
 * Filters out empty or blank education entries.
 */
export function filterEducation(
  eduList?: Array<{ institution?: string; degree?: string; year?: string; gpa?: string }>
) {
  if (!eduList) return [];
  return eduList.filter(
    edu => edu.institution?.trim() || edu.degree?.trim() || edu.year?.trim() || edu.gpa?.trim()
  );
}

/**
 * Filters out empty or blank projects entries.
 */
export function filterProjects(
  projList?: Array<{ name?: string; description?: string; technologies?: string }>
) {
  if (!projList) return [];
  return projList.filter(
    proj => proj.name?.trim() || proj.description?.trim() || proj.technologies?.trim()
  );
}

