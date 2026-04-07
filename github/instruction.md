Necesito diseñar e implementar un sistema de inventario para el área de Soporte Técnico (IT).

Objetivo general:
Controlar equipos, materiales e insumos de IT, permitiendo registrar entradas, salidas, asignaciones, devoluciones y bajas, manteniendo un historial completo de movimientos.

Requisitos funcionales:
1. Gestión de recursos (inventario):
   - Registrar recursos (equipos, materiales, insumos).
   - Tipos de recursos: Equipo, Material, Insumo.
   - Campos sugeridos:
     - Id
     - Código / Serial
     - Nombre
     - Descripción
     - Tipo
     - Estado (Disponible, Asignado, En Reparación, Dado de Baja, Consumido)
     - Stock (para insumos)
     - FechaAlta
     - Activo

2. Movimientos de inventario:
   - Registrar movimientos de:
     - Entrada (compra, devolución, reasignación)
     - Salida (asignación, consumo, baja)
   - Cada movimiento debe guardar:
     - Id
     - RecursoId
     - TipoMovimiento (Entrada / Salida)
     - Subtipo (Asignación, Devolución, Baja, Consumo, Compra)
     - Cantidad
     - Fecha
     - UsuarioResponsable
     - Observaciones

3. Asignación de equipos:
   - Permitir asignar equipos a personas.
   - Registrar:
     - PersonaId
     - FechaAsignación
     - FechaDevolución (nullable)
     - Estado de la asignación
   - Un equipo puede:
     - Estar asignado
     - Ser devuelto a soporte
     - Volver a asignarse a otra persona

4. Historial:
   - Consultar historial completo de movimientos por:
     - Recurso
     - Persona
     - Rango de fechas
   - El historial no debe perderse nunca (auditoría).

5. Bajas y consumos:
   - Permitir dar de baja equipos (daño, obsoleto, pérdida).
   - Permitir consumir insumos (disminuye stock).
   - No permitir stock negativo.

Requisitos técnicos:
- Arquitectura en capas (Entities / Repository / Service / UI o API).
- Aplicar principios SOLID y DRY.
- Manejo de transacciones para entradas y salidas.
- Validaciones:
  - No asignar recursos no disponibles.
  - No consumir más stock del disponible.
- Código claro, mantenible y escalable.

Base de datos (SQL Server):
- Diseñar tablas:
  - Recursos
  - MovimientosInventario
  - Asignaciones
  - Personas
- Usar claves primarias, foráneas y estados bien definidos.
- Considerar soft delete (Activo).

Salida esperada:
- Modelo de datos (tablas y relaciones).
- Clases de dominio / entidades.
- Servicios para:
  - Entrada de inventario
  - Salida de inventario
  - Asignación y devolución
  - Baja y consumo
- Ejemplos de consultas SQL o métodos de servicio.
