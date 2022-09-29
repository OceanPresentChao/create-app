#!/usr/bin/env node
/* eslint-disable no-console */

import minimist from 'minimist'
import prompt from 'prompts'
import { bold, cyan, green, red, yellow } from 'kolorist'
import 'zx/globals'
const User = 'OceanPresentChao'

async function init() {
  const argv = minimist(process.argv.slice(2), { boolean: true })
  let targetDir = argv._[0]
  const defaultProjectName = targetDir || 'NewProject'
  let response: {
    projectName?: string
    packageName?: string
    projectTemplate?: string
  } = {}
  try {
    response = await prompt([
      {
        type: 'text',
        name: 'projectName',
        message: 'Project Name: ',
        onState: state => (targetDir = state.value.trim() || defaultProjectName),
        initial: defaultProjectName,
      },
      {
        name: 'packageName',
        type: () => (isValidPackageName(targetDir) ? null : 'text'),
        message: 'Package name:',
        initial: () => toValidPackageName(targetDir),
        validate: dir => isValidPackageName(dir) || 'Invalid package.json name',
      },
      {
        type: 'select',
        name: 'projectTemplate',
        message: 'Select Project Template: ',
        choices: [
          { title: 'starter-ts', value: 'starter-ts' },
          { title: 'starter-unplugin', value: 'starter-unplugin' },
          { title: 'starter-tauri', value: 'starter-tauri' },
        ],
        initial: 0,
        hint: '- choose template to use depending your project type',
      },
    ])
  }
  catch (error: any) {
    console.log(error.message)
    process.exit(1)
  }
  const cwd = process.cwd()
  const root = path.join(__dirname, targetDir)
  const {
    projectTemplate,
  } = response
  await $`git clone https://github.com/${User}/${projectTemplate}`
  cd (`./${projectTemplate}`)
  fs.removeSync('.git')
  console.log('\nDone. Now run:\n')
  if (root !== cwd)
    console.log(`  ${bold(red(`cd ${path.relative(cwd, root)}`))}`)
  console.log(`  ${bold(green('pnpm install'))}`)
  console.log(`  ${bold(cyan('pnpm run lint'))}`)
  console.log(`  ${bold(yellow('pnpm run dev'))}`)
}

function isValidPackageName(name: string) {
  return /^(@[a-z0-9-*~][a-z0-9-*~_]*)?[a-z0-9~][a-z0-9-._~]*$/.test(name)
}

function toValidPackageName(name: string) {
  return name.trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/^[_.]/, '').replace(/[^a-z0-9-~]/g, '-')
}
init()
