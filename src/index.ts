#!/usr/bin/env node
/* eslint-disable no-console */

import minimist from 'minimist'
import prompt from 'prompts'
import { bold, cyan, green, red, yellow } from 'kolorist'
import { RepoNames, UserName } from './config'
import 'zx/globals'
import { getComander, isValidPackageName, toValidPackageName } from './utils'
async function init() {
  const argv = minimist(process.argv.slice(2), { boolean: true })
  let targetDir = argv._[0]
  const defaultProjectName = targetDir || 'NewProject'
  let response: {
    projectName?: string
    packageName?: string
    projectTemplate?: keyof typeof RepoNames
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
          { title: 'starter-ts', value: 'typescript' },
          { title: 'starter-unplugin', value: 'unplugin' },
          { title: 'starter-tauri', value: 'tauri' },
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
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent) ? 'pnpm' : /yarn/.test(userAgent) ? 'yarn' : 'npm'
  const {
    projectTemplate,
    projectName,
  } = response
  const reponame = RepoNames[projectTemplate!]
  await $`git clone https://github.com/${UserName}/${reponame}`
  fs.renameSync(`./${projectTemplate}`, `./${projectName}`)
  cd (`./${projectName}`)
  fs.removeSync('.git')
  console.log('\nDone. Now run:\n')
  if (root !== cwd)
    console.log(`  ${bold(red(`cd ${path.relative(cwd, root)}`))}`)
  console.log(`  ${bold(green(getComander(packageManager, 'install')))}`)
  console.log(`  ${bold(cyan(getComander(packageManager, 'lint')))}`)
  console.log(`  ${bold(yellow(getComander(packageManager, 'dev')))}`)
}

init().catch((e) => {
  console.error(e)
})
