const os = require('os');

const cpuTimes = { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 };
const virtualCpu = () => ({
  model: 'virtual',
  speed: 0,
  times: { ...cpuTimes },
});

try {
  const current = os.cpus();
  if (!Array.isArray(current) || current.length === 0) {
    os.cpus = () => [virtualCpu()];
  }
} catch {
  os.cpus = () => [virtualCpu()];
}
