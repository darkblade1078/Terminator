import { Command } from '@sapphire/framework';
import embeds from '../embeds';
import pnwAPI from '../apis/pnw';
import buttons from "../buttons";

export class WhoCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { client, users } = this.container;
        const embedCreator = new embeds(client);
        const whoButton = new buttons();
        const api = new pnwAPI(this.container);
        const discordUser = interaction.options.getUser(`user`, true);
        const user = users.get(discordUser.id);

        if (!user)
            return interaction.editReply({ embeds: [embedCreator.error(`User is not verified with the bot`)] });

        const data = await api.getWhoData(user.nationId);

        if (data == null)
            return interaction.editReply({ embeds: [embedCreator.error(`Could not find nation`)] });

        return interaction.editReply({ components: [whoButton.whoButtonRow(data)], embeds:[embedCreator.whoEmbed(interaction, data)], });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('who')
                .setDescription('Find the nation of a discord user')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user of the nation you want to find')
                        .setRequired(true)
                )
        );
    }
}