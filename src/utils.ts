export function isValidPackageName(name: string) {
  return /^(@[a-z0-9-*~][a-z0-9-*~_]*)?[a-z0-9~][a-z0-9-._~]*$/.test(name)
}

export function toValidPackageName(name: string) {
  return name.trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/^[_.]/, '').replace(/[^a-z0-9-~]/g, '-')
}

export function getComander(packageType: string, scriptName: string) {
  if (scriptName === 'install')
    return packageType === 'yarn' ? 'yarn' : `${packageType} install`

  return packageType === 'npm' ? `npm run ${scriptName}` : `${packageType} ${scriptName}`
}
