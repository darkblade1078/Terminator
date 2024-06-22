import { Subcommand } from '@sapphire/plugin-subcommands';
import embeds from '../embeds';
import pnwAPI from '../apis/pnw';
import dataTypesUtilities from '../utils/dataTypes';
import { PermissionFlagsBits } from 'discord.js';

export class SettingsCommand extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
            name: 'settings',
            subcommands: [
                {
                    name: 'your_alliances',
                    chatInputRun: 'yourAlliances'
                },
                {
                    name: 'enemy_alliances',
                    chatInputRun: 'enemyAlliances'
                },
                {
                    name: 'view_settings',
                    chatInputRun: 'viewSettings'
                }
            ]
        });
    }

    public async yourAlliances(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { client, servers, serverDatabase, logger } = this.container;
        const embedCreator = new embeds(client);
        const api = new pnwAPI(this.container);
        const arrayUtils = new dataTypesUtilities();
        const change = interaction.options.getString(`change`, true);
        const alliance = interaction.options.getInteger(`alliance`, true);

        if (interaction.memberPermissions?.has([PermissionFlagsBits.Administrator]))
            return interaction.editReply({ embeds: [embedCreator.error(`You must be an admin to use this command`)] });

        //check why removing the ! gives a type error
        const serverData = servers.get(interaction.guildId!);

        if (!serverData)
            return interaction.editReply({ embeds: [embedCreator.error(`Server does not exist in the database`)] });

        let alliancesArray = arrayUtils.convertStringtoIntArray(serverData.extensions);

        switch (change) {

            case 'add':

                if (alliancesArray.find(allianceIndex => allianceIndex == alliance))
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is already in the database`)] });

                const allianceData = await api.checkAllianceExistence(alliance);

                if (allianceData == null)
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance does not exist`)] });

                alliancesArray.push(alliance);
                serverData.extensions = arrayUtils.convertIntArraytoString(alliancesArray);

                await serverDatabase.save(serverData).catch(err => {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to add alliance to the database`)] });
                });
                servers.set(serverData.serverId, serverData);

                return interaction.editReply({ embeds: [embedCreator.default(`Added Alliance`, `Added ${allianceData.name} (${allianceData.id}) to the database`)] });


            default:

                if (alliancesArray.length == 0)
                    return interaction.editReply({ embeds: [embedCreator.error(`There are no alliances in the database`)] });

                const index = alliancesArray.indexOf(alliance);

                if (index == -1)
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is not in the database`)] });

                alliancesArray.splice(index, 1);

                serverData.extensions = alliancesArray.length > 0 ? arrayUtils.convertIntArraytoString(alliancesArray) : "";

                await serverDatabase.save(serverData).catch(err => {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to remove alliance from the database`)] });
                })
                servers.set(serverData.serverId, serverData);

                return interaction.editReply({ embeds: [embedCreator.default(`Removed Alliance`, `Removed the alliance with the id of ${alliance} from the database`)] });
        }
    }

    public async enemyAlliances(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { client, servers, serverDatabase, logger } = this.container;
        const embedCreator = new embeds(client);
        const api = new pnwAPI(this.container);
        const arrayUtils = new dataTypesUtilities();
        const change = interaction.options.getString(`change`, true);
        const alliance = interaction.options.getInteger(`alliance`, true);

        if (interaction.memberPermissions?.has([PermissionFlagsBits.Administrator]))
            return interaction.editReply({ embeds: [embedCreator.error(`You must be an admin to use this command`)] });

        //check why removing the ! gives a type error
        const serverData = servers.get(interaction.guildId!);

        if (!serverData)
            return interaction.editReply({ embeds: [embedCreator.error(`Server does not exist in the database`)] });

        let alliancesArray = arrayUtils.convertStringtoIntArray(serverData.enemyAlliances);

        switch (change) {

            case 'add':

                if (alliancesArray.find(allianceIndex => allianceIndex == alliance))
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is already in the database`)] });

                const allianceData = await api.checkAllianceExistence(alliance);

                if (allianceData == null)
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance does not exist`)] });

                alliancesArray.push(alliance);
                serverData.enemyAlliances = arrayUtils.convertIntArraytoString(alliancesArray);

                await serverDatabase.save(serverData).catch(err => {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to add alliance to the database`)] });
                });
                servers.set(serverData.serverId, serverData);

                return interaction.editReply({ embeds: [embedCreator.default(`Added Alliance`, `Added ${allianceData.name} (${allianceData.id}) to the database`)] });


            default:

                if (alliancesArray.length == 0)
                    return interaction.editReply({ embeds: [embedCreator.error(`There are no alliances in the database`)] });

                const index = alliancesArray.indexOf(alliance);

                if (index == -1)
                    return interaction.editReply({ embeds: [embedCreator.error(`Alliance is not in the database`)] });

                alliancesArray.splice(index, 1);

                serverData.enemyAlliances = alliancesArray.length > 0 ? arrayUtils.convertIntArraytoString(alliancesArray) : "";

                await serverDatabase.save(serverData).catch(err => {
                    logger.error(err);
                    return interaction.editReply({ embeds: [embedCreator.error(`Failed to remove alliance from the database`)] });
                })
                servers.set(serverData.serverId, serverData);

                return interaction.editReply({ embeds: [embedCreator.default(`Removed Alliance`, `Removed the alliance with the id of ${alliance} from the database`)] });
        }
    }

    public async viewSettings(interaction: Subcommand.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { client, servers } = this.container;
        const embedCreator = new embeds(client);
        const server = servers.get(interaction.guildId!);

        if (interaction.memberPermissions?.has([PermissionFlagsBits.Administrator]))
            return interaction.editReply({ embeds: [embedCreator.error(`You must be an admin to use this command`)] });

        if (!server)
            return interaction.editReply({ embeds: [embedCreator.error(`Server does not exist in the database`)] });

        return interaction.editReply({ embeds: [embedCreator.viewSettingsEmbed(server, interaction.guild!)] });
    }

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('settings')
                .setDescription('Change the settings of the bot')
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addSubcommand((command) =>
                    command
                        .setName('your_alliances')
                        .setDescription('Make changes to the alliances associated with the server')
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
                .addSubcommand((command) =>
                    command
                        .setName('enemy_alliances')
                        .setDescription('Make changes to the alliances you are fighting against')
                        .addStringOption((option) =>
                            option.setName('change')
                                .setDescription('Whether you want to add or remove enemy alliances to the server')
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
                .addSubcommand((command) =>
                    command
                        .setName('view_settings')
                        .setDescription('View the settings of your server')
                )

        );
    }
}