import BuildingType from './building-type.enum';

export const BuildingsRelativity: Record<BuildingType, Record<BuildingType, true>> = <any>{};

function setupRelativity(from: BuildingType, to: BuildingType): void {
  let relations = BuildingsRelativity[from];

  if (!relations) {
    relations = <any>{};
    BuildingsRelativity[from] = relations;
  }

  relations[to] = true;
}

function setupRelativity2(type1: BuildingType, type2: BuildingType): void {
  setupRelativity(type1, type2);
  setupRelativity(type2, type1);
}

setupRelativity2(BuildingType.OilDerrick, BuildingType.OilRefinery);
setupRelativity2(BuildingType.OilDerrick, BuildingType.PlasticRefinery);
setupRelativity2(BuildingType.CoalMine, BuildingType.Furnace);
setupRelativity2(BuildingType.IronMine, BuildingType.Furnace);
setupRelativity2(BuildingType.Furnace, BuildingType.ToolsAssembly);
setupRelativity2(BuildingType.Furnace, BuildingType.CarsAssembly);
setupRelativity2(BuildingType.PlasticRefinery, BuildingType.ToysAssembly);
setupRelativity2(BuildingType.CoalMine, BuildingType.PowerPlant);
setupRelativity2(BuildingType.WaterPump, BuildingType.PowerPlant);
setupRelativity2(BuildingType.PowerPlant, BuildingType.Turbine);

export function areRelative(type1: BuildingType, type2: BuildingType): boolean {
  const relations = BuildingsRelativity[type1];
  return relations ? relations[type2] : false;
}
