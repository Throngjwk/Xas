import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "amogus";
var name = "Xas Forruf";
var description = "what";
var authors = "Throngjwk";
var version = 1;

var currency;
var ඞ1, ඞ2, q1;
var ඞ1Exp, ඞ2Exp;

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // ඞ1
    {
        let getDesc = (level) => "ඞ_1=" + getඞ1(level).toString(0);
        ඞ1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))));
        ඞ1.getDescription = (_) => Utils.getMath(getDesc(ඞ1.level));
        ඞ1.getInfo = (amount) => Utils.getMathTo(getDesc(ඞ1.level), getDesc(ඞ1.level + amount));
    }

    // ඞ2
    {
        let getDesc = (level) => "ඞ_2=2^{" + level + "}";
        let getInfo = (level) => "ඞ_2=" + getඞ2(level).toString(0);
        ඞ2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)));
        ඞ2.getDescription = (_) => Utils.getMath(getDesc(ඞ2.level));
        ඞ2.getInfo = (amount) => Utils.getMathTo(getInfo(ඞ2.level), getInfo(ඞ2.level + amount));
    }

    // q1
    {
        let getDesc = (level) => "q_1=2^{" + level + "}";
        let getInfo = (level) => "q_1=" + getQ1(level).toString(0);
        q1 = theory.createUpgrade(2, currency, new ExponentialCost(5000000, Math.log2(10)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getInfo(q1.level), getInfo(q1.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));

    {
        ඞ1Exp = theory.createMilestoneUpgrade(0, 3);
        ඞ1Exp.description = Localization.getUpgradeIncCustomExpDesc("ඞ_1", "0.05");
        ඞ1Exp.info = Localization.getUpgradeIncCustomExpInfo("ඞ_1", "0.05");
        ඞ1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        ඞ2Exp = theory.createMilestoneUpgrade(1, 3);
        ඞ2Exp.description = Localization.getUpgradeIncCustomExpDesc("ඞ_2", "0.05");
        ඞ2Exp.info = Localization.getUpgradeIncCustomExpInfo("ඞ_2", "0.05");
        ඞ2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Achievement 1", "Description 1", () => ඞ1.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Achievement 2", "Description 2", "Maybe you should buy two levels of ඞ2?", () => ඞ2.level > 1);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => ඞ1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => ඞ2.level > 0);

    updateAvailability();
}

var updateAvailability = () => {
    ඞ2Exp.isAvailable = ඞ1Exp.level > 0;
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += dt * bonus * getඞ1(ඞ1.level) * getඞ2(ඞ2.level) * getQ1(q1.level);
                                   
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = ඞ_1";

    if (ඞ1Exp.level == 1) result += "^{1.05}";
    if (ඞ1Exp.level == 2) result += "^{1.1}";
    if (ඞ1Exp.level == 3) result += "^{1.15}";

    result += "ඞ_2";

    if (ඞ2Exp.level == 1) result += "^{1.05}";
    if (ඞ2Exp.level == 2) result += "^{1.1}";
    if (ඞ2Exp.level == 3) result += "^{1.15}";

    return result;
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getඞ1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);
var getඞ2 = (level) => BigNumber.TWO.pow(level);
var getQ1 = (level) => BigNumber.TWO.pow(level);
var getඞ1Exponent = (level) => BigNumber.from(1 + 0.05 * level);
var getඞ2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();