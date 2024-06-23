import { Command } from '@sapphire/framework';
import { Container } from '@sapphire/pieces';
import kit from 'pnwkit-2.0';
import { alliance } from 'pnwkit-2.0/build/src/interfaces/queries/alliance';
import { nation } from 'pnwkit-2.0/build/src/interfaces/queries/nation';
import { messageResult } from 'pnwkit-2.0/build/src/interfaces/v2/sendMessage';

export default class pnwAPI {

    container: Container;

    constructor(container: Container) {
        kit.setKeys(`${process.env.PNW_API_KEY}`);
        this.container = container;
    }

    async checkNationExistence(nationId: number): Promise<nation | null> {

        const data = await kit.nationQuery({ first: 1, id: [nationId] },
            `
                id
                nation_name
                leader_name
                `,
            false
        ).catch(err => {
            this.container.logger.error(err);
            return null;
        });

        return !data || data.length == 0 ? null : data[0];
    }

    async sendVerificationMessage(nation: nation, token: string, interaction: Command.ChatInputCommandInteraction): Promise<messageResult | null> {
        const data = await kit.sendMessage(
            Number(nation.id),
            `Verification Message`,
            `Hello there, ${nation.leader_name}.
                
                If you are reading this message, a discord account: ${interaction.user.username} (${interaction.user.id}) is trying to verify your nation with their discord.
                If this is you, run the verify command again and paste your token into the token argument to finsh your verification.
                If this is not you, then ignore this message.
    
                token: ${token}
                `
        ).catch(err => {
            this.container.logger.error(err);
            return null;
        });

        return data;
    }

    async checkAllianceExistence(allianceId: number): Promise<alliance | null> {

        const data = await kit.allianceQuery({ first: 1, id: [allianceId] },
            `
                    id
                    name
                `,
            false
        ).catch(err => {
            this.container.logger.error(err);
            return null;
        });

        return !data || data.length == 0 ? null : data[0];
    }

    async getWhoData(nationId: number): Promise<nation | null> {

        const data = await kit.nationQuery({ first: 1, id: [nationId] },
            `
                id
                alliance_id
                nation_name
                leader_name
                last_active
                date
                num_cities
                color
                domestic_policy
                score
                war_policy
                soldiers
                tanks
                aircraft
                ships
                missiles
                nukes
                flag
                offensive_wars_count
                defensive_wars_count
                pirate_economy
                advanced_pirate_economy
                `,
            false
        ).catch(err => {
            this.container.logger.error(err);
            return null;
        });

        return !data || data.length == 0 ? null : data[0];
    }

}