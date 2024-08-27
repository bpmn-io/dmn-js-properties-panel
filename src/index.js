export { default as DmnPropertiesPanelModule } from './render';
export { default as DmnPropertiesProviderModule } from './provider/dmn';
export { default as CamundaPropertiesProviderModule } from './provider/camunda';
export { default as ZeebePropertiesProviderModule } from './provider/zeebe';

export { TooltipProvider as ZeebeTooltipProvider } from './contextProvider/zeebe';

// hooks
export { useService } from './hooks';
