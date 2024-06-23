import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { nation } from "pnwkit-2.0/build/src/interfaces/queries/nation";

export default class buttons {
    private row: ActionRowBuilder;

    constructor() {
        this.row = new ActionRowBuilder();
    }

    whoButtonRow(nation: nation): ActionRowBuilder<ButtonBuilder> {
        const declare = new ButtonBuilder()
            .setLabel('Declare War')
            .setURL(`https://politicsandwar.com/nation/war/declare/id=${nation.id}`)
            .setStyle(ButtonStyle.Link);

        const spy = new ButtonBuilder()
            .setLabel('Spy')
            .setURL(`https://politicsandwar.com/nation/espionage/eid=${nation.id}`)
            .setStyle(ButtonStyle.Link);

        const trade = new ButtonBuilder()
            .setLabel('Trade')
            .setURL(`https://politicsandwar.com/nation/trade/create?leadername=${nation.leader_name}`)
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(declare, spy, trade);

        return row;
    }
} 