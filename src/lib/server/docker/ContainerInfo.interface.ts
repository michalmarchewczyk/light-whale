export interface ContainerInfo {
    id:string,
    names:string[],
    imageName:string,
    imageId:string,
    command:string,
    created:Date,
    state:string,
    status:string,
    compose:string | null,
    networks:Record<string, unknown>,
}
