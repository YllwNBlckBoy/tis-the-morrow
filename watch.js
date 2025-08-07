const chokidar = require("chokidar");
const { exec } = require("child_process");


const watcher = chokidar.watch(['docs', 'layout', 'assets'], {
  persistent: true,
  ignoreInitial: true,
  usePolling: true,
  interval: 300,
});
 
function rebuild() {
  console.log('[BUILD] Rebuilding site...');
  exec('node build.js', (err, stdout, stderr) => {
    if (err) {
      console.error('[BUILD ERROR]', stderr);
    } else {
      console.log('[BUILD SUCCESS]', stdout);
    }
  });
}

watcher
  .on('add', rebuild)
  .on('change', rebuild)
  .on('unlink', rebuild);
