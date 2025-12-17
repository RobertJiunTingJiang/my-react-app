/*
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 這裡就是問題所在。原本是 '/my-react-app/'
  // 請將其修改為 './'
  base: './', 

  plugins: [react()],
})