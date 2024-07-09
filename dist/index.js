#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
const program = new Command();
program.version('0.0.1').description('CLI to scaffold a TS project with opttional extras');
program
    .command('init <projectName>')
    .description('Initialise a new TypeScript project')
    .action(async (projectName) => {
    console.log(chalk.blue(`Initialising project: ${projectName}`));
    // make project direcotry
    fs.mkdirSync(projectName);
    process.chdir(projectName);
    //initialise package.json
    execSync('pnpm init');
    // install typescript
    execSync('pnpm add -D typescript @types/node');
    // create tsconfig.json
    const tsconfigContent = {
        "compilerOptions": {
            "compilerOptions": {
                /* Base Options: */
                "esModuleInterop": true,
                "skipLibCheck": true,
                "target": "es2022",
                "allowJs": true,
                "resolveJsonModule": true,
                "moduleDetection": "force",
                "isolatedModules": true,
                // "verbatimModuleSyntax": true,
                /* Strictness */
                "strict": true,
                "noUncheckedIndexedAccess": true,
                /* If transpiling with TypeScript: */
                "moduleResolution": "NodeNext",
                "module": "NodeNext",
                "outDir": "dist",
                "rootDir": "src",
                "sourceMap": true,
                /* AND if you're building for a library: */
                // "declaration": true,
                /* AND if you're building for a library in a monorepo: */
                // "composite": true,
                // "declarationMap": true,
                /* If NOT transpiling with TypeScript: */
                // "module": "preserve",
                // "noEmit": true,
                /* If your code runs in the DOM: */
                "lib": ["es2022", "dom", "dom.iterable"]
                /* If your code doesn't run in the DOM: */
                // "lib": ["es2022"]
            },
            "include": ["src/**/*"],
            "exclude": ["node_modules"]
        }
    };
    fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfigContent, null, 2));
    // create src and dist directories
    fs.mkdirSync('src');
    fs.mkdirSync('dist');
    // create index.ts
    fs.writeFileSync('src/index.ts', '');
    // update package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    packageJson.scripts = {
        build: "tsc",
        start: "node dist/index.js",
        dev: "ts-node src/index.ts",
        lint: "eslint . --ext .ts",
        format: "prettier --write \"src/**/*.ts\"",
        test: "echo \"Error: no test specified\" && exit 1"
    };
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    // asking for optional extras the sauces:
    const { extras } = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'extras',
            message: 'Select optional extras:',
            choices: [
                { name: 'eslint', value: 'eslint' },
                { name: 'prettier', value: 'prettier' },
                { name: 'vitest', value: 'vitest' },
                { name: 'expressjs', value: 'expressjs' }
            ]
        }
    ]);
    // install the selected extras
    if (extras.includes('eslint')) {
        execSync('pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin');
        createEslintConfig();
    }
    if (extras.includes('prettier')) {
        execSync('pnpm add -D prettier eslint-config-prettier');
        createPrettierConfig();
    }
    if (extras.includes('vitest')) {
        execSync('pnpm add -D vitest');
        createVitestScript(packageJson);
    }
    if (extras.includes('expressjs')) {
        execSync('pnpm add express @types/express');
        createExpressApp();
    }
    console.log(chalk.green('Project initialised successfully'));
});
//create eslint config on selection
function createEslintConfig() {
    const eslintConfig = {
        "env": {
            "browser": true,
            "es2021": true,
            "node": true
        },
        "extends": [
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended"
        ],
        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": 12,
            "sourceType": "module"
        },
        "plugins": [
            "@typescript-eslint"
        ],
        "rules": {
            "indent": ["error", 2],
            "linebreak-style": ["error", "unix"],
            "quotes": ["error", "single"],
            "semi": ["error", "always"],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off"
        }
    };
    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintConfig, null, 2));
    console.log(chalk.green('Eslint config ✅'));
}
//create prettier config  
function createPrettierConfig() {
    const prettierConfig = {
        "semi": true,
        "trailingComma": "all",
        "singleQuote": true,
        "printWidth": 80,
        "tabWidth": 2
    };
    fs.writeFileSync('.prettierrc.json', JSON.stringify(prettierConfig, null, 2));
    console.log(chalk.green('Prettier config ✅'));
}
//update vitest script
function createVitestScript(packageJson) {
    packageJson.scripts.test = "vitest";
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('Vitest script updated in package.json ✅'));
}
//create express app on selection 
function createExpressApp() {
    const appContent = `
import express from 'express';
const app=express();
const port = 54321;
app.get('/',(req,res)=>{
    res.send('Hello World');
});
app.listen(port,()=>{
  console.log(\`Server running at http://localhost:\${port}\`);
});`;
    fs.writeFileSync(path.join('src', 'app.ts'), appContent);
    console.log(chalk.green('Express app initialised 🚀'));
}
program.parse(process.argv);
//# sourceMappingURL=index.js.map