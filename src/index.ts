import { readFile } from 'fs/promises';
import path from 'path';
async function main() {
    const workingDirectory = path.resolve(process.cwd());
    console.log(workingDirectory);
}
main();