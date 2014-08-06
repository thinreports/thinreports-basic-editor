namespace :css do

  include ThinReportsEditor

  desc 'Compress and merge CSS files'
  task :compile do
    require 'yaml'

    run_command do
      css_files = YAML.load_file(css_config_yml)
      css_files.map!{|f| File.join(css_file_path(f)) }

      add "java -jar #{closure_stylesheets_jar} "
      add "#{css_files.join(' ')} "
      add "--output-file #{path_from_assets('app.css')}"
      add "--allowed-non-standard-function color-stop"
    end
  end
end

# Aliases

desc 'Alias for css:compile'
task :cc => [:'css:compile']
