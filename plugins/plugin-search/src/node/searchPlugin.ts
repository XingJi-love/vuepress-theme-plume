import chokidar from 'chokidar'
import type { Plugin } from 'vuepress/core'
import { getDirname, path } from 'vuepress/utils'
import { addViteOptimizeDepsInclude } from '@vuepress/helper'
import type { SearchPluginOptions } from '../shared/index.js'
import { onSearchIndexRemoved, onSearchIndexUpdated, prepareSearchIndex } from './prepareSearchIndex.js'

const __dirname = getDirname(import.meta.url)

export function searchPlugin({
  locales = {},
  isSearchable,
  ...searchOptions
}: SearchPluginOptions = {}): Plugin {
  return app => ({
    name: '@vuepress-plume/plugin-search',
    clientConfigFile: path.resolve(__dirname, '../client/config.js'),
    define: {
      __SEARCH_LOCALES__: locales,
      __SEARCH_OPTIONS__: searchOptions,
    },
    extendsBundlerOptions(bundlerOptions) {
      addViteOptimizeDepsInclude(bundlerOptions, app, ['mark.js/src/vanilla.js', '@vueuse/integrations/useFocusTrap', 'minisearch'])
    },
    onPrepared: async (app) => {
      await prepareSearchIndex({ app, isSearchable, searchOptions })
    },
    onWatched: async (app, watchers) => {
      const searchIndexWatcher = chokidar.watch('pages/**/*.js', {
        cwd: app.dir.temp(),
        ignoreInitial: true,
      })
      searchIndexWatcher.on('add', (filepath) => {
        onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
      })
      searchIndexWatcher.on('change', (filepath) => {
        onSearchIndexUpdated(filepath, { app, isSearchable, searchOptions })
      })
      searchIndexWatcher.on('unlink', (filepath) => {
        onSearchIndexRemoved(filepath, { app, isSearchable, searchOptions })
      })
      watchers.push(searchIndexWatcher)
    },
  })
}
