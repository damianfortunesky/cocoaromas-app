import { useState } from 'react';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { Card } from '@/shared/ui/Card/Card';
import { Badge } from '@/shared/ui/Badge/Badge';
import { DataTable } from '@/shared/ui/DataTable/DataTable';
import { Loader } from '@/shared/ui/Loader/Loader';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Alert } from '@/shared/ui/Alert/Alert';
import styles from './UIShowcasePage.module.scss';

const sampleRows = [
  ['Vela Aura', 'Sahumerios', '$9.900', <Badge key="a">Stock bajo</Badge>],
  ['Perfume Bloom', 'Perfumes', '$14.500', <Badge key="b">Disponible</Badge>],
  ['Jabón Rosas', 'Jabones', '$4.500', <Badge key="c">Nuevo</Badge>]
];

export function UIShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>UI Showcase</h1>
        <p>Referencia visual de los componentes base del design system de CocoAromas.</p>
      </header>

      <section>
        <h2>Botones</h2>
        <div className={styles.row}>
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button loading disabled>Cargando</Button>
        </div>
      </section>

      <section>
        <h2>Inputs</h2>
        <div className={styles.inputs}>
          <Input label="Nombre" placeholder="Ingresá tu nombre" />
          <Input label="Email" type="email" placeholder="cliente@correo.com" />
          <Input label="Cupón" placeholder="COCO10" error="Cupón inválido" />
        </div>
      </section>

      <section>
        <h2>Cards y badges</h2>
        <div className={styles.cards}>
          <Card>
            <Badge>Destacado</Badge>
            <h3>Kit bienestar</h3>
            <p>Incluye vela aromática, jabón artesanal y perfume floral.</p>
          </Card>
          <Card>
            <Badge>Edición limitada</Badge>
            <h3>Set primavera</h3>
            <p>Fragancias frescas para renovar tu espacio.</p>
          </Card>
        </div>
      </section>

      <section>
        <h2>Tabla</h2>
        <DataTable headers={['Producto', 'Categoría', 'Precio', 'Estado']} rows={sampleRows} />
      </section>

      <section>
        <h2>Loaders</h2>
        <div className={styles.row}>
          <Loader />
          <Loader />
          <Loader />
        </div>
      </section>

      <section>
        <h2>Modales</h2>
        <Button onClick={() => setIsModalOpen(true)}>Abrir modal</Button>
      </section>

      <section>
        <h2>Alerts</h2>
        <div className={styles.alerts}>
          <Alert title="Info">Actualizamos el catálogo con nuevos productos.</Alert>
          <Alert variant="success" title="Éxito">Tu pedido fue confirmado correctamente.</Alert>
          <Alert variant="warning" title="Atención">Quedan pocas unidades disponibles.</Alert>
          <Alert variant="danger" title="Error">No se pudo procesar el pago.</Alert>
        </div>
      </section>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3>Modal de ejemplo</h3>
          <p>Este modal muestra el estilo base para overlays y contenido destacado.</p>
          <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
        </Modal>
      )}
    </div>
  );
}
