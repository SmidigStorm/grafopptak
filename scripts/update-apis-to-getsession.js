const fs = require('fs');
const path = require('path');

// Liste over API-filer som må oppdateres
const apiFiles = [
  'app/api/kravelementer/[id]/route.ts',
  'app/api/grunnlag/route.ts',
  'app/api/grunnlag/[id]/route.ts',
  'app/api/kvotetyper/route.ts',
  'app/api/kvotetyper/[id]/route.ts',
  'app/api/rangeringstyper/route.ts',
  'app/api/rangeringstyper/[id]/route.ts',
];

// Funksjon for å oppdatere en fil
function updateFile(filePath) {
  const fullPath = path.join('/home/storm/grafopptak', filePath);

  try {
    let content = fs.readFileSync(fullPath, 'utf8');

    // Fjern Neo4jDatabase import og config
    content = content.replace(
      /import { NextRequest, NextResponse } from 'next\/server';\nimport { Neo4jDatabase } from '@\/lib\/neo4j';\n\nconst db = new Neo4jDatabase\({[\s\S]*?\}\);/,
      "import { NextRequest, NextResponse } from 'next/server';\nimport { getSession } from '@/lib/neo4j';"
    );

    // Oppdater GET funksjon
    content = content.replace(
      /export async function GET\(\s*(request: NextRequest,\s*)?({[^}]*})?\s*\) {\s*(?:try {\s*)?(?:const { id } = await params;\s*)?/g,
      (match) => {
        if (match.includes('params')) {
          return match.replace(
            /try {/,
            'const { id } = await params;\n  const session = getSession();\n\n  try {'
          );
        } else {
          return 'export async function GET() {\n  const session = getSession();\n  \n  try {';
        }
      }
    );

    // Oppdater POST funksjon
    content = content.replace(
      /export async function POST\(request: NextRequest\) {\s*try {/g,
      'export async function POST(request: NextRequest) {\n  const session = getSession();\n  \n  try {'
    );

    // Oppdater PUT funksjon
    content = content.replace(
      /export async function PUT\(\s*request: NextRequest,\s*{ params }[^)]*\) {\s*(?:try {\s*)?(?:const { id } = await params;\s*)?/g,
      'export async function PUT(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await params;\n  const session = getSession();\n\n  try {'
    );

    // Oppdater DELETE funksjon
    content = content.replace(
      /export async function DELETE\(\s*request: NextRequest,\s*{ params }[^)]*\) {\s*(?:try {\s*)?(?:const { id } = await params;\s*)?/g,
      'export async function DELETE(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await params;\n  const session = getSession();\n\n  try {'
    );

    // Erstatt db.runQuery med session.run
    content = content.replace(/await db\.runQuery\(/g, 'await session.run(');

    // Legg til session.close() i alle catch/finally blocks
    content = content.replace(/} catch \(error\) {([\s\S]*?)}\s*}/g, (match, catchContent) => {
      return `} catch (error) {${catchContent}} finally {\n    await session.close();\n  }\n}`;
    });

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Oppdater alle filer
console.log('🔄 Updating API files to use getSession()...\n');
apiFiles.forEach(updateFile);
console.log('\n✨ Done!');
