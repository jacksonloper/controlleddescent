/// <reference types="vite/client" />

declare module '*.scad?raw' {
  const source: string
  export default source
}

declare module '*.scad?url' {
  const url: string
  export default url
}
