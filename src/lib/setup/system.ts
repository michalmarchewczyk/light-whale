import {exec} from 'child_process';
import process from 'process';

export const getSystem = async ():Promise<string> => new Promise((resolve, reject) => {
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
	exec('cat /etc/*release | grep -E ^NAME', function(error, stdout, stderr) {
		if(error || stderr){
			resolve('');
			return;
		}
		const name = stdout.trim().split('=')[1].trim();
		resolve(name);
	});
});


export const getDockerVersion = async ():Promise<string> => new Promise((resolve) => {
	exec('docker version', function(error, stdout, stderr) {
		if(error || stderr){
			resolve('');
			return;
		}
		resolve('true');
	});
});
