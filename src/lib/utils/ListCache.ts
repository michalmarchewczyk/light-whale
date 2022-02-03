class ListCache<T> {
	private cached:Record<string, T> = {};

	constructor(private fetchFunction:(index:string)=>(T|Promise<T>)){

	}

	public async prefetch(indexes:string[]):Promise<void>{
		indexes.forEach((index) => {
			this.fetch(index);
		});
	}

	public async get(index:string):Promise<T>{
		const item = this.cached[index];
		if(!item){
			return await this.fetch(index);
		}
		return item;
	}

	private async fetch(index:string):Promise<T>{
		const fetched = await this.fetchFunction(index);
		this.cached[index] = fetched;
		return fetched;
	}
}

export default ListCache;
