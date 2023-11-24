import { Subcommand } from '@sapphire/plugin-subcommands';
import embeds from '../embeds';
import pnwAPI from '../apis/pnw';

export class SettingsCommand extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'settings',
            subcommands: [
                {
                    name: 'alliances',
                    chatInputRun: 'alliances'
                }
            ]
        });
    }

    public async alliances(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { client, servers, serverDatabase, logger } = this.container;
        const embedCreator = new embeds(client);
        const api = new pnwAPI(this.container);
        const change = interaction.options.getString(`change`, true);
        const alliance = interaction.options.getInteger(`alliance`, true);

        //check why removing the ! gives a type error
        const serverData = servers.get(interaction.guildId!);

        if (!serverData)
            return interaction.editReply({ embeds: [embedCreator.error(`Server does not exist in the database`)] });

        let alliancesArray = serverData.alliances.split(',');

        switch (change) {

            case 'add':

                if (alliancesArray.find(allianceIndex => Number(allianceIndex) == alliance))
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is already in the database`)] });

                const allianceData = await api.checkAllianceExistence(alliance);

                if (allianceData == null)
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance does not exist`)] });

                try {
                    alliancesArray[alliancesArray.length] = alliance.toString();
                    const newAlliancesArray = alliancesArray.join(',');

                    serverData.alliances = newAlliancesArray;
                    await serverDatabase.save(serverData);
                    servers.set(serverData.serverId, serverData);

                    return interaction.editReply({ embeds: [embedCreator.default(`Added Alliance`, `Added ${allianceData.name} (${allianceData.id}) to the database`)] });
                }
                catch (err) {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to add alliance to the database`)] });
                }

            default:

                if (!alliancesArray.find(allianceIndex => Number(allianceIndex) == alliance))
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is not in the database`)] });

                try {

                    const index = alliancesArray.indexOf(alliance.toString());

                    if (index > -1)
                        alliancesArray.splice(index, 1);

                    alliancesArray[alliancesArray.length] = alliance.toString();
                    const newAlliancesArray = alliancesArray.join(',');

                    serverData.alliances = newAlliancesArray;
                    await serverDatabase.save(serverData);
                    servers.set(serverData.serverId, serverData);

                    return interaction.editReply({ embeds: [embedCreator.default(`Removed Alliance`, `Removed the alliance with the id of ${alliance} from the database`)] });
                }
                catch (err) {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to remove alliance from the database`)] });
                }

        }
    }

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('settings')
                .setDescription('Change the settings of the bot')
                .addSubcommand((command) =>
                    command
                        .setName('alliances')
                        .setDescription('makes changes to the alliances associated with the server')
                        .addStringOption((option) =>
                            option.setName('change')
                                .setDescription('Whether you want to add or remove alliances to the server')
                                .setRequired(true)
                                .addChoices(
                                    { name: 'add', value: 'add' },
                                    { name: 'remove', value: 'remove' },
                                )
                        )
                        .addIntegerOption((option) =>
                            option.setName('alliance')
                                .setDescription('The id of the alliance you want to add')
                                .setRequired(true)
                        )
                )

        );
    }
}