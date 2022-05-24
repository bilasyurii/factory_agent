import GameplayEventType from "../gameplay/gameplay-event-type.enum";
import AgentCache from "../gameplay/player/agent-cache";
import HUD from "../ui/hud";
import HUDEventType from "../ui/hud-event-type.enum";
import FileManager from "./file-manager";

export default class ImportExportManager extends Phaser.Events.EventEmitter {
  private hud: HUD;
  private fileManager: FileManager;

  constructor(hud: HUD) {
    super();

    this.hud = hud;

    this.initFileManager();
    this.setupEvents();
  }

  public import(): void {
    this.fileManager.import(this.onImport);
  }

  public export(): void {
    AgentCache.snapshotRequested.emit(GameplayEventType.SnapshotRequested);
    this.fileManager.export(JSON.stringify(AgentCache.snapshot), 'snapshot.agent');
    this.emit(GameplayEventType.Export);
  }

  private initFileManager(): void {
    this.fileManager = new FileManager();
  }

  private setupEvents(): void {
    this.hud.on(HUDEventType.ImportPressed, this.import, this);
    this.hud.on(HUDEventType.ExportPressed, this.export, this);
  }

  private onImport = (data: any): void => {
    AgentCache.snapshot = JSON.parse(data);
    this.emit(GameplayEventType.Import);
  };
}
