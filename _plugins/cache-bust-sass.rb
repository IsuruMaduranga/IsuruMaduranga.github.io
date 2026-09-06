require 'digest/md5'

# jekyll-cache-bust's `bust_css_cache` digests `assets/_sass/**/*`, a directory
# this site does not have - its partials live in `_sass/`. The empty glob made
# every build stamp main.css with the MD5 of an empty string, so the token never
# changed and stylesheet updates could not invalidate a cached copy.
#
# `bust_sass_cache` digests the real sources instead: the SCSS entry point and
# every partial it pulls in.
module Jekyll
  module CacheBustSass
    SOURCES = ['assets/css/main.scss', '_sass/**/*'].freeze

    def bust_sass_cache(file_name)
      digest = Digest::MD5.hexdigest(source_contents)
      "#{file_name}?v=#{digest}"
    end

    private

    def source_contents
      SOURCES
        .flat_map { |pattern| Dir[pattern].sort }
        .reject { |path| File.directory?(path) }
        .map { |path| File.read(path) }
        .join
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBustSass)
