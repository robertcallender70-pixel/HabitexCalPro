export enum ActivityType {
    CIMENTACION_AISLADA = 'Cimentación Aislada',
    // FIX: Corrected typo from ZAPATA_CORRida to ZAPATA_CORRIDA
    ZAPATA_CORRIDA = 'Cimentación Corrida (Zapata)',
    COLUMNA = 'Columna',
    VIGA = 'Viga',
    LEVANTE_MURO = 'Levante de Muro',
    REVESTIMIENTO = 'Revestimiento',
    PISO = 'Piso',
    LOSA = 'Losa o Placa',
    PINTURA = 'Pintura',
    ENCHAPE_PARED = 'Enchape de Pared',
    ESTRUCTURA_PLADUR = 'Estructura de Pladur',
    CUSTOM = 'Actividad Personalizada',
    CUSTOM_MATERIAL_CALCULATION = 'Actividad de Material Personalizada',
}

export interface Project {
    id?: number;
    name: string;
    createdAt: Date;
    logisticsPercentage?: number;
    technicalAssistancePercentage?: number;
    transportPercentage?: number;
    contingencyPercentage?: number;
    profitPercentage?: number;
    clientName?: string;
    clientAddress?: string;
}

export interface Activity {
    id?: number;
    projectId: number;
    type: ActivityType;
    name: string;
    inputs: Record<string, any>;
    results: Material[];
}

export interface Material {
    name: string;
    quantity: number;
    unit: string;
    unitPrice?: number;
    layer?: string; // For multi-part activities like Revestimiento
    quantityAvailable?: number;
    quantityNeeded?: number;
}

export interface LaborItem {
    id?: number;
    projectId: number;
    name: string;
    unit: string;
    unitPrice: number;
    quantity: number;
    quantityCompleted?: number;
}

export interface BudgetItem {
    id?: number;
    projectId: number;
    category: string;
    name: string; // Description of the expense
    cost: number;
}

export enum TransactionType {
    INCOME = 'Ingreso',
    EXPENSE = 'Gasto',
}

export interface Transaction {
    id?: number;
    projectId: number;
    type: TransactionType;
    description: string;
    amount: number;
    date: string; // YYYY-MM-DD
    category?: string;
}

export interface InventoryItem {
    id?: number;
    projectId: number;
    name: string;
    unit: string;
    quantityPurchased: number;
    quantityUsed: number;
    dateAdded: string; // YYYY-MM-DD
}

export interface PredefinedLaborActivity {
    id: number;
    name: string;
    unit: string;
    priceMN: number;
    category: string;
    materialActivityType?: ActivityType;
}


export interface HormigonData {
    resistencia: number;
    cemento: number;
    arena: number;
    piedra: number;
    agua: number;
}

export interface AceroData {
    barra: number;
    pulgadas: string;
    mm: number;
    pesoUnit: number;
    area: number;
}

// FIX: Add missing type definitions for mortero data to resolve import errors.
export interface MorterosMurosData {
    id: string;
    nombre: string;
    unidades: number;
    cemento: number;
    arena: number;
    polvoPiedra: number;
}

export interface MorterosPisoData {
    id: string;
    nombre: string;
    unidades: number;
    cemento: number;
    arena: number;
    polvoPiedra: number;
}

export interface CertificationSnapshot {
    // Real costs tracked up to this point
    completedLaborItems: LaborItem[];
    materialTransactions: Transaction[];
    transportTransactions: Transaction[];
    manualExpenseItems: Transaction[];
    
    completedLaborCost: number;
    materialExpenseCost: number;
    transportExpenseCost: number;
    manualExpenseCost: number;

    // Project's percentage settings at the time of certification
    logisticsPercentage: number;
    technicalAssistancePercentage: number;
    profitPercentage: number;
    // Note: transportPercentage and contingencyPercentage are no longer used for calculation
    // but are kept for historical project data compatibility.
    // FIX: Add optional properties for historical data compatibility to resolve type error.
    transportPercentage?: number;
    contingencyPercentage?: number;

    // Calculated costs based on the real costs and percentages
    logisticsCost: number;
    technicalAssistanceCost: number;
    profitCost: number;
    
    grandTotal: number;
}


export interface Certification {
    id?: number;
    projectId: number;
    name: string;
    certifiedAt: string; // ISO Date string
    snapshot: CertificationSnapshot;
    invoicePdfBlob?: Blob;
}

export interface InvoiceData {
    project: Project;
    companyInfo: {
        name: string;
        address: string;
        phone: string;
    };
    invoiceInfo: {
        invoiceNumber: string;
        clientName: string;
        clientAddress: string;
        date: string;
        signerName: string;
        signerTitle: string;
    };
    // The items to be billed in THIS invoice
    billableItems: {
        description: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        total: number;
    }[];
    // The total for THIS invoice
    invoiceTotal: number;
    exchangeRate: number;
}


export interface OfferData {
    project: Project;
    companyInfo: {
        name: string;
        address: string;
        phone: string;
    };
    offerInfo: {
        offerNumber: string;
        clientName: string;
        clientAddress: string;
        date: string;
        validityDays: number;
        signerName: string;
        signerTitle: string;
    };
    totals: {
        material: number;
        labor: number;
        budget: number;
        grandTotal: number;
    };
    exchangeRate: number;
    laborItems: LaborItem[];
    materials: Material[];
    budgetItems: BudgetItem[];
}

export type CustomActivityUnit = 'm' | 'm²' | 'm³' | 'unidad';

export interface CustomMaterial {
    materialName: string;
    unit: string;
    ratio: number; // Consumption per unitOfMeasure
}

export interface CustomMaterialActivity {
    id: string; // Unique ID (e.g., timestamp)
    name: string;
    unitOfMeasure: CustomActivityUnit;
    materials: CustomMaterial[];
    enabled?: boolean;
}

export interface CommercialUnitRule {
    id: string;
    materialName: string; // The name to match (substring).
    baseUnit: string;
    rule: 'ceil' | 'multiple-increment' | 'multiple-options' | 'best-fit-combination';
    increment?: number; // For `multiple-increment`
    options?: number[]; // For `multiple-options` and `best-fit-combination`
    selectedOption?: number; // The specific rebar length to use for calculation (e.g., 9)
    outputUnitFormat?: string; // A format string for the new unit, e.g., "barras de {option}m" or "cubetas de {increment}L"
}