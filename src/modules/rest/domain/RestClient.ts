import {REST, type RESTOptions} from 'discord.js';

export default class RestClient extends REST {
    constructor(options: Partial<RESTOptions>) {
        super(options);
    }
}