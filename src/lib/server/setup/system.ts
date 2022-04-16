import {exec} from 'child_process';
import process from 'process';
import {logger, LogType} from '$lib/server/utils/Logger';

export const getSystem = async ():Promise<string> => new Promise((resolve, reject) => {
	logger.log(LogType.Info, 'Reading System Info');
	if(process.platform === 'win32'){
		resolve('Windows');
		return;
	}
	if(process.platform === 'darwin'){
		resolve('macOS');
		return;
	}
	if(process.platform !== 'linux'){
		reject('');
		return;
	}
	exec('cat /etc/*release | grep -E ^NAME', (error, stdout, stderr) => {
		if(error || stderr){
			resolve('');
			return;
		}
		const name = stdout.trim().split('=')[1].trim();
		resolve(name);
	});
});


export const getDockerVersion = async ():Promise<string> => new Promise((resolve) => {
	logger.log(LogType.Verbose, 'Checking Docker version');
	exec('docker version', function(error, stdout, stderr) {
		if(error || stderr){
			logger.log(LogType.Error, 'Could not find Docker');
			resolve('');
			return;
		}
		resolve('true');
	});
});
