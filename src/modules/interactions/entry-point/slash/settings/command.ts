
export default {
    type: 1,
    name: "settings",
    description: "Control the settings for the IPC",
    options: [
        {
            type: 1,
            name: "channel",
            description: "Which channels broadcasts should be dispatched to",
            options: [
                {
                    type: 7,
                    name: "channel",
                    description: "The channel to dispatch to",
                    required: true,
                    channel_types: [
                        0,
                    ],
                }
            ]
        },
        {
            type: 1,
            name: "receive-broadcasts",
            description: "Whether to receive broadcasts from the IPC",
            options: [
                {
                    type: 5,
                    name: "enabled",
                    description: "Whether to receive broadcasts from the IPC",
                    required: true,
                }
            ],
        },
    ],
};