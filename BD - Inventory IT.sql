



-- Tabla de los Departamentos de la empresa.
CREATE TABLE dbo.Department (
    DepartmentId INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Abbreviation VARCHAR(10) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);


-- Tabla de los elementos (Laptop, Celular, Case, etc...)
CREATE TABLE dbo.ElementType (
    ElementTypeId INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Abbreviation VARCHAR(10) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);


-- Marca de los elementos (Lenovo, ASUS, Logitech, etc...)
CREATE TABLE dbo.Brand (
    BrandId INT IDENTITY PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Abbreviation VARCHAR(10) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);








-- Tabla para agregar al personal asignado de los elementos
CREATE TABLE dbo.Person (
    PersonId INT IDENTITY PRIMARY KEY,
    FullName VARCHAR(150) NOT NULL,
    DepartmentId INT NOT NULL,
    Position VARCHAR(100) NULL,
    Email VARCHAR(100) NULL,
	[Description] VARCHAR(500) NULL,
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Person_Department
        FOREIGN KEY (DepartmentId) REFERENCES dbo.Department(DepartmentId)
);




-- Tabla de informacion para los Equipos
CREATE TABLE dbo.Asset (
    AssetId INT IDENTITY PRIMARY KEY,
    ElementTypeId INT NOT NULL, -- Catalog (Elemento)
    BrandId INT NOT NULL,       -- Catalog (Marca)
    Model VARCHAR(100),
    Serial VARCHAR(100) UNIQUE,
    Year INT,
    Code VARCHAR(50) UNIQUE,
    Status VARCHAR(20) NOT NULL, -- Disponible | Asignado | Baja
    Condition VARCHAR(20),       -- Bueno | Regular | Malo
    Notes VARCHAR(MAX),
    Active BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Asset_Element FOREIGN KEY (ElementTypeId) REFERENCES dbo.ElementType(ElementTypeId),
    CONSTRAINT FK_Asset_Brand FOREIGN KEY (BrandId) REFERENCES dbo.Brand(BrandId)
);




-- Tablas para descripcion tecnica (Solo para computadoras)
CREATE TABLE dbo.AssetSpecs (
    AssetId INT PRIMARY KEY,
    HardDrive VARCHAR(50),
    RAM VARCHAR(50),
    Processor VARCHAR(100),

    CONSTRAINT FK_AssetSpecs_Asset
        FOREIGN KEY (AssetId) REFERENCES dbo.Asset(AssetId)
);



CREATE TABLE dbo.AssetAssignment (
    AssignmentId INT IDENTITY PRIMARY KEY,
    AssetId INT NOT NULL,
    PersonId INT NOT NULL,
    DepartmentId INT NOT NULL,
    AssignedDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Notes VARCHAR(MAX),

    CONSTRAINT FK_Assign_Asset FOREIGN KEY (AssetId)
        REFERENCES dbo.Asset(AssetId),

    CONSTRAINT FK_Assign_Person FOREIGN KEY (PersonId)
        REFERENCES dbo.Person(PersonId),

    CONSTRAINT FK_Assign_Department FOREIGN KEY (DepartmentId)
        REFERENCES dbo.Department(DepartmentId)
);


SELECT dep.Name,
       dep.Abbreviation,
       per.FullName,
       per.Position,
       assetAssig.AssignedDate,
	   elem.Name,
	   bran.Name,
       Asset.Model,
       Asset.Serial,
       Asset.Year,
       Asset.Code,
       Asset.Status,
       Asset.Condition,
       Asset.Notes,
       Asset.CreatedAt,
       assetSp.HardDrive,
       assetSp.RAM,
       assetSp.Processor
FROM dbo.Department dep
    INNER JOIN dbo.Person per
        ON dep.DepartmentId = per.DepartmentId
    INNER JOIN dbo.AssetAssignment assetAssig
        ON per.PersonId = assetAssig.PersonId
    INNER JOIN dbo.Asset Asset
        ON assetAssig.AssetId = Asset.AssetId
	INNER JOIN dbo.ElementType elem 
		ON elem.ElementTypeId = Asset.ElementTypeId
	INNER JOIN dbo.Brand bran
		ON bran.BrandId = asset.BrandId
    LEFT JOIN dbo.AssetSpecs assetSp
        ON Asset.AssetId = assetSp.AssetId;





-- ==============================================================================
-- Insersiones
-- ==============================================================================
INSERT INTO dbo.Department (Name, Abbreviation)
SELECT DISTINCT
    Depar,
    AbreDepar
FROM (
    VALUES
    ('INFORMATICA','A'),
    ('CONTABILIDAD','I'),
    ('BO','C'),
    ('BODEGA','D'),
    ('PRINTING','E'),
    ('PLANTA','F'),
    ('PACK','G'),
    ('GERENCIA','H'),
    ('RRHH','B'),
    ('COMPRAS','J'),
    ('CALIDAD','K'),
    ('COTIZACIONES','L'),
    ('IMPO/EXPO','M')
) AS D(Depar, AbreDepar);




INSERT INTO dbo.ElementType (Name, Abbreviation)
SELECT DISTINCT
    Element,
    AbreElement
FROM (
    VALUES
    ('Laptop','LAP'),
    ('Celular','CEL'),
    ('Case','CAS'),
    ('Teclado','KEY'),
    ('Monitor','MON'),
    ('Batería','BAT'),
    ('Server','SER'),
    ('Impresora','IMP'),
    ('Cámara fotográfica','CFO'),
    ('Conector para Audio','COA'),
    ('Radio','RAD'),
    ('Etiquetadora','ETQ'),
    ('Pistola','PIS'),
    ('Reloj marcado','REJ'),
    ('Audífonos','AUD'),
    ('Teléfono','TEL'),
    ('Celda de Batería','CEB'),
    ('Medidor','MED'),
    ('Router','ROU'),
    ('Escaner Láser','ESC'),
    ('Tarjetas de Red','TAR'),
    ('Cámara de video','CAV'),
    ('Fuente de poder','FPO'),
    ('Control','CON'),
    ('Parlantes','PAR'),
    ('Soplete','SOP'),
    ('Multímetro','MUL'),
    ('Enclúster','ENC'),
    ('Micrófono PC','MIC'),
    ('Ponchadora RJ45 Orag','POO'),
    ('Televisor','TLV'),
    ('Ponchadora RJ46 Blue','POB'),
    ('Tableta grafica','TBG'),
    ('Mouse','MOU'),
    ('Swith','SWI'),
    ('Trituradora de papel','TRI'),
    ('Kit','KIT'),
    ('Emplasticadora','EMP'),
    ('Disco Duro Solido','SSD'),
    ('Adaptador RJ45-C','ADP')
) AS E(Element, AbreElement);



INSERT INTO dbo.Brand (Name, Abbreviation)
SELECT DISTINCT
    BrandName,
    BrandAbre
FROM (
    VALUES
    ('Lenovo','LENO'),
    ('Motorola SYMBOL','MOTO'),
    ('ASUS','ASUS'),
    ('Logitech','LOGI'),
    ('Acer','ACER'),
    ('ACP','ACP'),
    ('HP','HP'),
    ('Tecknet','TECK'),
    ('Bixolon','BIXL'),
    ('LG','LG'),
    ('Gateway','GTWY'),
    ('Forza','FORZ'),
    ('AOC','AOC'),
    ('Panasonic','PANA'),
    ('msi','MSI'),
    ('MPOW','MPOW'),
    ('KENWOOD','KENW'),
    ('Planar','PLANA'),
    ('Wasp','WASP'),
    ('Power Patrol','PWP'),
    ('CDP','CDP'),
    ('Generic','GENR'),
    ('Clon','CLON'),
    ('Sony','SONY'),
    ('Maxell','MAXL'),
    ('SAMSUNG','SAMS'),
    ('CPD','CPD'),
    ('Klip Xtreme','KPXT'),
    ('Zebra','ZEBR'),
    ('Verbatim','VERB'),
    ('Avaya','AVYA'),
    ('DYMO','DYMO'),
    ('eMachine','EMAC'),
    ('DELL','DELL'),
    ('Brother','BROT'),
    ('Uniden','UNID'),
    ('WD My Cloud','WDMC'),
    ('Trendnet','TREN'),
    ('Linksys','LINK'),
    ('Cisco','CISC'),
    ('Connectland','CLAN'),
    ('Q-SEE','QSEE'),
    ('Five Star','FIST'),
    ('Wone Nice','WONI'),
    ('APC','APC'),
    ('Microsoft','MICR'),
    ('WDGPS','WDGP'),
    ('Wave','WAVE'),
    ('Ritar','RITA'),
    ('MHB','MHB'),
    ('Sonos','SONO'),
    ('EasyGo','EAGO'),
    ('ETEKCITY','ETEK'),
    ('FIDECO','FIDC'),
    ('Eastern Times tech','ETTE'),
    ('S/M','S/M'),
    ('ANVIZ','ANVZ'),
    ('Avantree','AVTR'),
    ('Huawei','HUAW'),
    ('Canon','CAN'),
    ('NOKIA','NOK'),
    ('Tripplite','TRLT'),
    ('Plusivo','PLU'),
    ('Gaomon','GOM'),
    ('HROEENOI','HRO'),
    ('Poly','POL'),
    ('D-Link','DLI'),
    ('Champtek','CHK'),
    ('Amazon Basic','AMBA'),
    ('VTech','VTE'),
    ('ZTE','ZTE'),
    ('XP-PEN','XPP'),
    ('Sceptre','SCE'),
    ('Gamaleon','GAM'),
    ('SanDisk','SDK'),
    ('Nexxt','NEX'),
    ('Hiija','HIJA'),
    ('Philips','PHIL')
) AS B(BrandName, BrandAbre);



INSERT INTO dbo.Person
(
    FullName,
    DepartmentId,
    Position,
    Email,
    Description,
    Active,
    CreatedAt
)
VALUES
(   'Martha Matute',      -- FullName - varchar(150)
    1,       -- DepartmentId - int
    '',    -- Position - varchar(100)
    'MarthaMatute@Deme.us',    -- Email - varchar(100)
    '',    -- Description - varchar(500)
    1, -- Active - bit
    DEFAULT  -- CreatedAt - datetime
    );


GO
INSERT INTO dbo.Asset
(
    ElementTypeId,
    BrandId,
    Model,
    Serial,
    Year,
    Code,
    Status,
    Condition,
    Notes,
    Active,
    CreatedAt
)
VALUES
(   1,       -- ElementTypeId - int
    1,       -- BrandId - int
    'G70-80',    -- Model - varchar(100)
    'PF09S7UV',    -- Serial - varchar(100)
    2020,    -- Year - int
    'LAPLENO2020A-1',    -- Code - varchar(50)
    'Asignado',      -- Status - varchar(20)
    'Bueno',    -- Condition - varchar(20)
    '',    -- Notes - varchar(max)
    1, -- Active - bit
    DEFAULT  -- CreatedAt - datetime
    );
GO


INSERT INTO dbo.AssetSpecs
(
    AssetId,
    HardDrive,
    RAM,
    Processor
)
VALUES
(   1,    -- AssetId - int
    '1TB', -- HardDrive - varchar(50)
    '8GB DDR3 Dual', -- RAM - varchar(50)
    'Intel Core i5 2.2GHz'  -- Processor - varchar(100)
    );


GO




INSERT INTO dbo.AssetAssignment
(
    AssetId,
    PersonId,
    DepartmentId,
    AssignedDate,
    ReturnDate,
    Notes
)
VALUES
(   1,         -- AssetId - int
    1,         -- PersonId - int
    1,         -- DepartmentId - int
    GETDATE(), -- AssignedDate - date
    NULL,      -- ReturnDate - date
    ''       -- Notes - varchar(max)
    )



SELECT * FROM dbo.[User]