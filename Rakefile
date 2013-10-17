task :default => [:build]

task :build => [:css, :jekyll]

task :css do
	sh "compass compile"
end

task :jekyll do
	sh "jekyll build"
end
