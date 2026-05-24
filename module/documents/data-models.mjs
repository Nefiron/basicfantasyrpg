const {
  ArrayField,
  BooleanField,
  HTMLField,
  NumberField,
  ObjectField,
  SchemaField,
  StringField
} = foundry.data.fields;

const stringField = (initial = '') => new StringField({ required: true, initial });
const htmlField = (initial = '') => new HTMLField({ required: true, initial });
const numberField = (initial = 0, options = {}) => new NumberField({
  required: true,
  initial,
  integer: Number.isInteger(initial),
  ...options
});
const booleanField = (initial = false) => new BooleanField({ required: true, initial });

function labeledField(valueField, label, abbr) {
  const schema = {
    value: valueField,
    label: stringField(label)
  };

  if (abbr) {
    schema.abbr = stringField(abbr);
  }

  return new SchemaField(schema);
}

function labeledNumber(initial, label, abbr, options = {}) {
  return labeledField(numberField(initial, options), label, abbr);
}

function labeledString(initial, label, abbr) {
  return labeledField(stringField(initial), label, abbr);
}

function valueField(initial = 0, options = {}) {
  return new SchemaField({ value: numberField(initial, options) });
}

function abilityField(initial = 10) {
  return new SchemaField({
    value: numberField(initial),
    bonus: numberField(0)
  });
}

function labeledValueMaxField(valueInitial, maxInitial, label, abbr) {
  const schema = {
    value: numberField(valueInitial),
    max: numberField(maxInitial),
    label: stringField(label)
  };

  if (abbr) {
    schema.abbr = stringField(abbr);
  }

  return new SchemaField(schema);
}

function actorBaseSchema() {
  return {
    armorClass: labeledNumber(11, 'BASICFANTASYRPG.ArmorClass', 'BASICFANTASYRPG.ArmorClassAbbr'),
    attackBonus: labeledNumber(1, 'BASICFANTASYRPG.AttackBonus', 'BASICFANTASYRPG.AttackBonusAbbr'),
    biography: htmlField(''),
    hitPoints: labeledValueMaxField(10, 10, 'BASICFANTASYRPG.HitPoints', 'BASICFANTASYRPG.HitPointsAbbr'),
    initBonus: labeledNumber(0, 'BASICFANTASYRPG.InitiativeBonus'),
    move: labeledNumber(30, 'BASICFANTASYRPG.Movement'),
    saves: new SchemaField({
      death: valueField(13),
      wands: valueField(14),
      paralysis: valueField(15),
      breath: valueField(16),
      spells: valueField(18)
    })
  };
}

function itemBaseSchema() {
  return {
    description: htmlField('')
  };
}

function valuableItemSchema() {
  return {
    price: labeledString('', 'BASICFANTASYRPG.Price'),
    weight: labeledString('1', 'BASICFANTASYRPG.Weight')
  };
}

class CharacterActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(actorBaseSchema(), {
      abilities: new SchemaField({
        str: abilityField(10),
        int: abilityField(10),
        wis: abilityField(10),
        dex: abilityField(10),
        con: abilityField(10),
        cha: abilityField(10)
      }),
      age: labeledString('', 'BASICFANTASYRPG.Age'),
      class: labeledString('', 'BASICFANTASYRPG.Class'),
      race: labeledString('', 'BASICFANTASYRPG.Race'),
      sex: labeledString('', 'BASICFANTASYRPG.Sex'),
      level: labeledNumber(1, 'BASICFANTASYRPG.Level'),
      money: new SchemaField({
        pp: valueField(0),
        gp: valueField(0),
        ep: valueField(0),
        sp: valueField(0),
        cp: valueField(0)
      }),
      spellsPerLevel: new SchemaField({
        value: new SchemaField({
          '1': numberField(0),
          '2': numberField(0),
          '3': numberField(0),
          '4': numberField(0),
          '5': numberField(0),
          '6': numberField(0)
        }),
        label: stringField('BASICFANTASYRPG.SpellsPerLevel')
      }),
      xp: new SchemaField({
        value: numberField(0),
        next: numberField(2000),
        label: stringField('BASICFANTASYRPG.ExperiencePoints'),
        abbr: stringField('BASICFANTASYRPG.ExperiencePointsAbbr')
      })
    });
  }
}

class MonsterActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(actorBaseSchema(), {
      hitDice: new SchemaField({
        size: stringField('d8'),
        number: numberField(1),
        mod: numberField(0),
        label: stringField('BASICFANTASYRPG.HitDice'),
        abbr: stringField('BASICFANTASYRPG.HitDiceAbbr')
      }),
      morale: labeledNumber(7, 'BASICFANTASYRPG.Morale'),
      numberAppearing: labeledString('1d4', 'BASICFANTASYRPG.NumberAppearing'),
      specialAbility: labeledNumber(0, 'BASICFANTASYRPG.SpecialAbilityXPBonus'),
      treasureType: labeledString('None', 'BASICFANTASYRPG.TreasureType'),
      xp: labeledNumber(0, 'BASICFANTASYRPG.ExperiencePoints', 'BASICFANTASYRPG.ExperiencePointsAbbr')
    });
  }
}

class SiegeEngineActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      attackBonus: labeledNumber(0, 'BASICFANTASYRPG.AttackBonus', 'BASICFANTASYRPG.AttackBonusAbbr'),
      biography: htmlField(''),
      cost: labeledString('', 'BASICFANTASYRPG.Cost'),
      damage: labeledNumber(0, 'BASICFANTASYRPG.Damage'),
      rangeBonus: labeledNumber(0, 'BASICFANTASYRPG.RangeBonus'),
      rangeShort: labeledString('', 'BASICFANTASYRPG.RangeShort'),
      rangeMedium: labeledString('', 'BASICFANTASYRPG.RangeMedium'),
      rangeLong: labeledString('', 'BASICFANTASYRPG.RangeLong'),
      rateOfFire: labeledString('', 'BASICFANTASYRPG.RateOfFire'),
      targetAC: labeledNumber(20, 'BASICFANTASYRPG.TargetAC')
    };
  }
}

class StrongholdActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      biography: htmlField(''),
      costMultiplier: labeledNumber(1, 'BASICFANTASYRPG.CostMultiplier'),
      floors: new ArrayField(new ObjectField(), { required: true, initial: [] }),
      followers: labeledNumber(0, 'BASICFANTASYRPG.Followers'),
      workers: labeledNumber(1, 'BASICFANTASYRPG.Workers')
    };
  }
}

class VehicleActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      armorClass: labeledNumber(11, 'BASICFANTASYRPG.ArmorClass', 'BASICFANTASYRPG.ArmorClassAbbr'),
      biography: htmlField(''),
      cargo: labeledNumber(0, 'BASICFANTASYRPG.Cargo'),
      hardness: labeledNumber(6, 'BASICFANTASYRPG.Hardness'),
      hitPoints: new SchemaField({
        aft: labeledValueMaxField(16, 16, 'BASICFANTASYRPG.SideAft'),
        forward: labeledValueMaxField(16, 16, 'BASICFANTASYRPG.SideForward'),
        port: labeledValueMaxField(16, 16, 'BASICFANTASYRPG.SidePort'),
        starboard: labeledValueMaxField(16, 16, 'BASICFANTASYRPG.SideStarboard'),
        value: numberField(0),
        max: numberField(0),
        label: stringField('BASICFANTASYRPG.HitPoints'),
        abbr: stringField('BASICFANTASYRPG.HitPointsAbbr')
      }),
      length: labeledNumber(35, 'BASICFANTASYRPG.Length'),
      maneuverability: labeledString("15'", 'BASICFANTASYRPG.Maneuverability'),
      move: new SchemaField({
        value: numberField(20),
        current: numberField(20),
        label: stringField('BASICFANTASYRPG.Movement')
      }),
      width: labeledNumber(8, 'BASICFANTASYRPG.Width')
    };
  }
}

class ItemItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), foundry.utils.mergeObject(valuableItemSchema(), {
      quantity: labeledNumber(1, 'BASICFANTASYRPG.Quantity')
    }));
  }
}

class WeaponItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), foundry.utils.mergeObject(valuableItemSchema(), {
      bonusAb: labeledNumber(0, 'BASICFANTASYRPG.BonusAttackBonus'),
      damage: labeledString('1d6', 'BASICFANTASYRPG.Damage', 'BASICFANTASYRPG.DamageAbbr'),
      range: labeledString('Melee', 'BASICFANTASYRPG.Range'),
      size: labeledString('M', 'BASICFANTASYRPG.Size')
    }));
  }
}

class ArmorItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), foundry.utils.mergeObject(valuableItemSchema(), {
      armorClass: labeledNumber(11, 'BASICFANTASYRPG.ArmorClass', 'BASICFANTASYRPG.ArmorClassAbbr')
    }));
  }
}

class SpellItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), {
      class: labeledString('', 'BASICFANTASYRPG.Class'),
      duration: labeledString('', 'BASICFANTASYRPG.Duration'),
      prepared: labeledNumber(0, 'BASICFANTASYRPG.Prepared'),
      range: labeledString('', 'BASICFANTASYRPG.Range'),
      spellLevel: labeledNumber(1, 'BASICFANTASYRPG.SpellLevel')
    });
  }
}

class FeatureItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), {
      formula: labeledString('d100', 'BASICFANTASYRPG.Formula'),
      rollUnder: new SchemaField({
        value: booleanField(true),
        label: stringField('BASICFANTASYRPG.RollUnder')
      }),
      targetNumber: labeledString('', 'BASICFANTASYRPG.TargetNumber')
    });
  }
}

class FloorItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), {
      price: labeledNumber(0, 'BASICFANTASYRPG.Price'),
      weight: labeledString('1', 'BASICFANTASYRPG.Weight'),
      area: labeledNumber(0, 'BASICFANTASYRPG.Area'),
      height: labeledNumber(10, 'BASICFANTASYRPG.Height'),
      material: labeledString('floor', 'BASICFANTASYRPG.Material')
    });
  }
}

class WallItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return foundry.utils.mergeObject(itemBaseSchema(), {
      price: labeledNumber(0, 'BASICFANTASYRPG.Price'),
      weight: labeledString('1', 'BASICFANTASYRPG.Weight'),
      floor: labeledNumber(0, 'TYPES.Item.floor'),
      hardness: labeledNumber(6, 'BASICFANTASYRPG.Hardness'),
      material: labeledString('wood', 'BASICFANTASYRPG.Material'),
      quantity: labeledNumber(1, 'BASICFANTASYRPG.Quantity'),
      thickness: labeledNumber(1, 'BASICFANTASYRPG.Thickness')
    });
  }
}

export const ACTOR_DATA_MODELS = {
  character: CharacterActorData,
  monster: MonsterActorData,
  siegeEngine: SiegeEngineActorData,
  stronghold: StrongholdActorData,
  vehicle: VehicleActorData
};

export const ITEM_DATA_MODELS = {
  item: ItemItemData,
  weapon: WeaponItemData,
  armor: ArmorItemData,
  spell: SpellItemData,
  feature: FeatureItemData,
  floor: FloorItemData,
  wall: WallItemData
};