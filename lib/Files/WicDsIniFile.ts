import File from "./File";

export default class WicDsIniFile extends File {
    constructor(instanceKey: string, config: any) {
        super()
        const i = {
            ...config.Defaults,
            ...config.Instances[instanceKey]
        }
        this.write('//~~ This is a generated file. Any modifications made will be overwritten', '', '')

        this.booleanSetting('ReportToMassgate', i.ReportToMassgate)
        this.requiredSetting('GameName', (config.GlobalConfig.GameNamePrefix || '') + i.GameName + (config.GlobalConfig.GameNameSuffix || ''))
        this.stringSetting('Password', i.Password)
        this.stringSetting('AdminPassword', i.AdminPassword)
        this.integerSetting('AdminPort', i.AdminPort || 0)
        this.stringSetting('CustomMapPath', i.CustomMapPath)
        this.stringSetting('MapCycleFile', 'wic_ds_cycle.txt')
        this.stringSetting('ModName', i.ModName)
        this.booleanSetting('RandomMapCycle', i.RandomMapCycle)
        this.booleanSetting('NonLinearDominationDisabled', i.NonLinearDominationDisabled)
        this.stringSetting('MessageOfTheDayFile', 'wic_ds_motd.txt')
        this.stringSetting('BannerUrl', i.BannerUrl)
        this.integerSetting('MinPlayers', i.MinPlayersPerTeam)
        this.integerSetting('MaxPlayers', i.MaxPlayersPerTeam * 2)
        this.booleanSetting('MatchMode', i.MatchMode)
        this.booleanSetting('FewPlayerMode', i.FewPlayerMode)
        this.booleanSetting('RankedFlag', i.Ranked)
        this.booleanSetting('TournamentFlag', i.Tournament)
        this.booleanSetting('ClanMatchFlag', i.ClanMatch)
        this.integerSetting('QueryPort', i.QueryPort)
        this.integerSetting('GamePortStartRange', i.GamePortRangeStart)
        this.booleanSetting('StayOnteam', i.StayOnTeam)
        this.booleanSetting('UseFireWallSettings', i.UseFireWallSettings)
        this.stringSetting('PrivateIP', '111.222.123.123')
        this.integerSetting('RestartInterval', 0)
        this.integerSetting('MaxTeamImbalanceCount', i.MaxTeamImbalanceCount)
        this.booleanSetting('AutoBalanceTeams', i.AutoBalanceTeams)
        this.integerSetting('AutoBalanceStartDelay', i.AutoBalanceStartDelay)
        this.booleanSetting('RankBalanceTeams', i.RankBalanceTeams)
        this.fixedIntegerSetting('TimeLimitMultiplier', i.TimeLimitMultiplier)
        this.write('[UseCDKey]', i.UseCDKey ? 'yes' : 'no', '') // TODO
        this.booleanSetting('AllowSpectating', i.AllowSpectating)
        this.booleanSetting('AllowFreeSpectating', i.AllowFreeSpectating)
        this.booleanSetting('AllowSpectatorVoting', i.AllowSpectatorVoting)
        this.integerSetting('NumAllowedPlayersPerRole', i.NumAllowedPlayersPerRole)
        this.integerSetting('MaxNumAllowedTeamChanges', i.MaxNumAllowedTeamChanges)
        this.integerSetting('BanTime', i.BanTime)
        this.stringSetting('BanFileName', 'wic_ds_banlist.txt')
        this.integerSetting('MaxAllowedIdleTime', i.MaxAllowedIdleTime)
        this.integerSetting('ChatTimeSpan', i.ChatTimeSpan)
        this.integerSetting('BotMode', i.BotMode)
        this.integerSetting('BotMode_AutoEven_NumPlayersPerTeam', i.AutoEvenPlayersPerTeam)
        this.integerSetting('BotMode_AutoEven_BotDifficulty', i.AutoEvenBotDifficulty)
        this.integerSetting('MaxChatMessages', i.MaxChatMessages)
        this.integerSetting('ChatSpamMuteTime', i.ChatSpamMuteTime)
        this.integerSetting('RequestTimeSpan', i.RequestTimeSpan)
        this.integerSetting('MaxRequests', i.MaxRequests)
        this.integerSetting('RequestSpamMuteTime', i.RequestSpamMuteTime)
        this.integerSetting('FriendlyFireLimit', i.FriendlyFireLimit)
        this.integerSetting('BotMode_PvsB_BotTeam', i.PvsBBotTeam)
        this.integerSetting('BotMode_PvsB_NumBots', i.PvsBNumBots)
        this.integerSetting('BotMode_PvsB_BotDifficulty', i.PvsBBotDifficulty)

        // this.write('[BotMode_Advanced_Team1Bot1_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot1_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot1_RoleId]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot1_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot2_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot2_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot2_RoleId]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot2_AIDefinition]')
        // this.write('0')
        // this.write('')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot3_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot3_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot3_RoleId]')
        // this.write('2')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot3_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot4_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot4_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot4_RoleId]')
        // this.write('3')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot4_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot5_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot5_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot5_RoleId]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot5_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot6_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot6_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot6_RoleId]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot6_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot7_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot7_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot7_RoleId]')
        // this.write('2')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot7_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot8_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot8_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot8_RoleId]')
        // this.write('3')
        // this.write('')

        // this.write('[BotMode_Advanced_Team1Bot8_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot1_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot1_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot1_RoleId]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot1_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot2_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot2_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot2_RoleId]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot2_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot3_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot3_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot3_RoleId]')
        // this.write('2')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot3_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot4_Active]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot4_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot4_RoleId]')
        // this.write('3')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot4_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot5_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot5_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot5_RoleId]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot5_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot6_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot6_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot6_RoleId]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot6_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot7_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot7_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot7_RoleId]')
        // this.write('2')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot7_AIDefinition]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot8_Active]')
        // this.write('0')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot8_Difficulty]')
        // this.write('1')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot8_RoleId]')
        // this.write('3')
        // this.write('')

        // this.write('[BotMode_Advanced_Team2Bot8_AIDefinition]')
        // this.write('0')
        // this.write('')
    }

    private settingKey(name: string) {
        this.write(`[${name}]`)
    }

    private booleanSetting(name: string, value: boolean) {
        if (value === undefined) {
            throw (new Error(`Undefined Value for "${name}"`))
        }

        this.settingKey(name)
        this.write(value ? '1' : '0', '')
    }

    private stringSetting(name: string, value?: string) {
        if (value === undefined) {
            throw (new Error(`Undefined Value for "${name}"`))
        }
        this.settingKey(name)
        this.write(value || 'no', '')
    }

    private requiredSetting(name: string, value: any) {
        if (value === undefined) {
            throw (new Error(`Undefined Value for "${name}"`))
        }
        this.settingKey(name)
        this.write(value, '')
    }

    private integerSetting(name: string, value: number) {
        if (value === undefined) {
            throw (new Error(`Undefined Value for "${name}"`))
        }
        this.settingKey(name)
        this.write(value.toString(), '')
    }

    private fixedIntegerSetting(name: string, value: number, places = 1) {
        if (value === undefined) {
            throw (new Error(`Undefined Value for "${name}"`))
        }
        this.settingKey(name)
        this.write(value.toFixed(), '')
    }
}