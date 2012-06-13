# coding: utf-8
require 'webrick'

desc 'Boot WebView'
task :webview do
  include TREDevelopment::Core
  
  server = WEBrick::HTTPServer.new(:BindAddress => '0.0.0.0',
                                   :Port => 3000,
                                   :DocumentRoot => File.expand_path(ROOT),
                                   :DirectoryIndex => ['application.html'],
                                   :AccessLog => [])
  Signal.trap(:INT) { server.shutdown }
  server.start
end
