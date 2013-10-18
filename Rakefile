task :default => [:build]

task :build => [:css, :jekyll]

task :css do
	sh 'compass compile'
end

task :jekyll do
	sh 'jekyll build'
end

task :server do
	compass_watcher = CompassWatcher.new
	jekyll_watcher = JekyllWatcher.new

	compass_watcher.start
	jekyll_watcher.start

	trap('INT') do
		compass_watcher.stop
		jekyll_watcher.stop
		exit 0
	end
end



class Watcher
	def initialize (command)
		@command = command
	end

	def start
		@pid = Process.spawn @command
	end

	def stop
		Process.kill(9, @pid) rescue "Unable to kill process %d." % @pid
		Process.wait @pid
	end
end

class CompassWatcher < Watcher
	def initialize
		super 'compass watch'
	end

	def start
		super
		$stderr.puts "Started process %d to watch Compass changes." % @pid
	end

	def stop
		super
		$stderr.puts "Ended Compass watch process %d." % @pid
	end
end

class JekyllWatcher < Watcher
	def initialize
		super 'jekyll serve --watch'
	end

	def start
		super
		$stderr.puts "Started Jekyll server process %d to watch for changes." % @pid
	end

	def stop
		super
		$stderr.puts "Ended Jekyll server and watch process %d." % @pid
	end
end

