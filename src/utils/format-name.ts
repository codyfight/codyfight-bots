export default function formatName(name: string | null): string {
  return name ? String(name)?.padEnd(10)?.toUpperCase() : 'Player'
}
