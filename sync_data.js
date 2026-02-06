
const fs = require('fs');
const path = require('path');

const backupFile = 'portfolio-backup-2026-02-06.json';
const dataFile = 'src/data/portfolio-data.js';

try {
    const backupPath = path.resolve(backupFile);
    const dataPath = path.resolve(dataFile);

    if (!fs.existsSync(backupPath)) {
        console.error(`Backup file not found: ${backupPath}`);
        process.exit(1);
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    let currentData = fs.readFileSync(dataPath, 'utf8');

    // Helper to replace an export
    // This regex looks for "export const NAME = [ ... ];" or "{ ... };"
    // safely catching nested brackets is hard with regex, assuming standard formatting or using start index.
    // simpler approach: replace entire blocks if we match variable declaration to next export or EOF.

    // BUT, since we simply want to rewrite the file with new data for specific keys:
    // We can extract parts we want to keep and rebuild the file. 
    // This acts as a clean-up too.

    // 1. Extract personalInfo
    const personalInfoMatch = currentData.match(/export const personalInfo = (\{[\s\S]*?\});/);
    const personalInfoStr = personalInfoMatch ? personalInfoMatch[1] : '{}';

    // 2. Extract publications (Keep as is, assuming user didn't export/modify these via Admin or they are static)
    const publicationsMatch = currentData.match(/export const publications = (\[[\s\S]*?\]);/);
    const publicationsStr = publicationsMatch ? publicationsMatch[1] : '[]';

    // 3. New Data from Backup
    // Backup keys: projects, events, skills
    // Target keys: featuredProjects, eventsAndAwards, skills

    // Safety check for arrays
    const newProjects = backupData.projects || [];
    const newEvents = backupData.events || [];
    const newSkills = backupData.skills || [];

    // Helper to format JSON for file (pretty print)
    const formatData = (data) => JSON.stringify(data, null, 4);

    const newFileContent = `// Portfolio Data - Easy to update and maintain
export const personalInfo = ${personalInfoStr};

// Publicações (Projetos, Eventos, Premiações)
export const publications = ${publicationsStr};

// Projetos em Destaque para o Carrossel
export const featuredProjects = ${formatData(newProjects)};

// Eventos e Premiações (Timeline)
export const eventsAndAwards = ${formatData(newEvents)};

export const skills = ${formatData(newSkills)};
`;

    fs.writeFileSync(dataPath, newFileContent, 'utf8');
    console.log('Successfully synced data to portfolio-data.js');

} catch (error) {
    console.error('Error syncing data:', error);
    process.exit(1);
}
