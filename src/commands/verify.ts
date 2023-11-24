import { Command } from '@sapphire/framework';
import embeds from '../embeds';
import pnwAPI from '../apis/pnw';
import { User } from '../entities';

export class VerifyCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        await interaction.deferReply();
        const token = interaction.options.getString(`token`, false);

        return await token ? this.stepTwo(interaction, token!) : this.stepOne(interaction);
    }

    public async stepOne(interaction: Command.ChatInputCommandInteraction) {

        const { client, users, userDatabase, logger } = this.container;
        const embedCreator = new embeds(client);
        const api = new pnwAPI(this.container);
        const nationId = interaction.options.getInteger(`nation_id`, true);

        if (users.get(interaction.user.id))
            return interaction.editReply({ embeds: [embedCreator.error(`You have already begun the verification process\nCheck your in-game messages for further instruction`)] });

        const nationData = await api.checkNationExistence(nationId);

        if (nationData == null)
            return interaction.editReply({ embeds: [embedCreator.error(`Nation does not exist`)] });

        const token = Math.random().toString(36).substr(2);

        const messageResults = await api.sendVerificationMessage(nationData, token, interaction);

        if (messageResults == null || !messageResults.success)
            return interaction.editReply({ embeds: [embedCreator.error(`Failed to send message to nation`)] });

        try {
            const newUser = new User();
            newUser.discordId = interaction.user.id;
            newUser.nationId = Number(nationData.id);
            newUser.verificationToken = token;
            newUser.verified = false;

            await userDatabase.insert(newUser);
            users.set(newUser.discordId, newUser);

            return interaction.editReply({ embeds: [embedCreator.default(`Success`, `Started the verification process, chen your in-game messages.`)] })
        }
        catch (err) {

            logger.error(err);
            return interaction.editReply({ embeds: [embedCreator.error(`Failed to add user to the database`)] });
        }
    }

    public async stepTwo(interaction: Command.ChatInputCommandInteraction, token: string) {

        const { client, users, userDatabase, logger } = this.container;
        const embedCreator = new embeds(client);
        const user = users.get(interaction.user.id);
        const nationId = interaction.options.getInteger(`nation_id`, true);

        if (!user)
            return interaction.editReply({ embeds: [embedCreator.error(`Nation does not exist in the database`)] });

        if (user.nationId != nationId)
            return interaction.editReply({ embeds: [embedCreator.error(`Nation id's do not match`)] });

        if (user.verified)
            return interaction.editReply({ embeds: [embedCreator.error(`Nation is already verified`)] });

        if (user.verificationToken != token)
            return interaction.editReply({ embeds: [embedCreator.error(`Verification tokens do not match`)] });

        try {
            user.verified = true;
            await userDatabase.save(user);
            users.set(user.discordId, user);

            return interaction.editReply({ embeds: [embedCreator.default(`Success`, `Your nation is now verified with your discord`)] });
        }
        catch (err) {
            logger.error(err);
            return interaction.editReply({ embeds: [embedCreator.error(`Failed to verify nation`)] });
        }
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('verify')
                .setDescription('Verify your nation to the bot')
                .addIntegerOption(option =>
                    option
                        .setName('nation_id')
                        .setDescription('Your nation id')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('token')
                        .setDescription('Your verification token')
                        .setRequired(false)
                )
        );
    }
}