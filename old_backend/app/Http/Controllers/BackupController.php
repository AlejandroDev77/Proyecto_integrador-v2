<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\DB; 
class BackupController extends Controller
{
    public function backup()
{
    $dbName = 'mi_base_de_datos'; // Solo comentario, PgAdmin debe tenerla seleccionada

    $finalSQL = "-- Exportación de base de datos \"$dbName\"\n\n";

    // Obtener todas las tablas públicas
    $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'");

    foreach ($tables as $tableObj) {
        $table = $tableObj->table_name;

        // Columnas
        $columns = DB::select("SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = '$table'
            ORDER BY ordinal_position");

        // Construir CREATE TABLE
        $createTableSQL = "DROP TABLE IF EXISTS \"$table\" CASCADE;\nCREATE TABLE \"$table\" (\n";
        $columnDefs = [];
        foreach ($columns as $col) {
            $line = "  \"$col->column_name\" " . strtoupper($col->data_type);
            if ($col->character_maximum_length) {
                $line .= "($col->character_maximum_length)";
            }
            if ($col->is_nullable === 'NO') {
                $line .= " NOT NULL";
            }
            // Default
            if ($col->column_default) {
                $line .= " DEFAULT $col->column_default";
            }
            $columnDefs[] = $line;
        }
        $createTableSQL .= implode(",\n", $columnDefs) . "\n);\n\n";

        $finalSQL .= $createTableSQL;

        // Insertar datos
        $rows = DB::table($table)->get();
        foreach ($rows as $row) {
            $attrs = (array)$row;
            $colNames = '"' . implode('", "', array_keys($attrs)) . '"';
            $colValues = collect(array_values($attrs))->map(function ($val) {
                if (is_null($val)) return 'NULL';
                return "'" . addslashes($val) . "'";
            })->implode(', ');
            $finalSQL .= "INSERT INTO \"$table\" ($colNames) VALUES ($colValues);\n";
        }
        $finalSQL .= "\n";

        // Claves primarias
        $pk = DB::select("
            SELECT kcu.column_name, tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
             AND tc.table_name = kcu.table_name
            WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = '$table'
            ORDER BY kcu.ordinal_position
        ");

        if (count($pk) > 0) {
            $pkCols = [];
            $constraintName = $pk[0]->constraint_name;
            foreach ($pk as $p) {
                $pkCols[] = "\"$p->column_name\"";
            }
            $finalSQL .= "ALTER TABLE \"$table\" ADD CONSTRAINT \"$constraintName\" PRIMARY KEY (" . implode(", ", $pkCols) . ");\n\n";
        }

        // Claves foráneas
        $fks = DB::select("
            SELECT
                tc.constraint_name, kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                 AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                 AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = '$table'
        ");

        foreach ($fks as $fk) {
            $finalSQL .= "ALTER TABLE \"$table\" ADD CONSTRAINT \"$fk->constraint_name\" FOREIGN KEY (\"$fk->column_name\") REFERENCES \"$fk->foreign_table_name\"(\"$fk->foreign_column_name\");\n";
        }
        if (count($fks) > 0) {
            $finalSQL .= "\n";
        }

        // Índices (no PK ni FK)
        $indexes = DB::select("
            SELECT indexname, indexdef FROM pg_indexes WHERE tablename = '$table' AND indexname NOT IN (
                SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = '$table'
            )
        ");

        foreach ($indexes as $index) {
            $finalSQL .= $index->indexdef . ";\n";
        }
        if (count($indexes) > 0) {
            $finalSQL .= "\n";
        }

        // Secuencias para columnas serial (auto incrementales)
        foreach ($columns as $col) {
            if ($col->column_default && strpos($col->column_default, 'nextval') !== false) {
                // Extraer secuencia del default nextval
                preg_match("/nextval\('(.+?)'::regclass\)/", $col->column_default, $matches);
                if (isset($matches[1])) {
                    $seqName = $matches[1];
                    $finalSQL .= "-- Secuencia para $table.$col->column_name\n";
                    $finalSQL .= "SELECT pg_catalog.setval('$seqName', COALESCE((SELECT MAX(\"$col->column_name\") FROM \"$table\"), 1), false);\n\n";
                }
            }
        }
    }

    return response($finalSQL)
        ->header('Content-Type', 'text/plain')
        ->header('Content-Disposition', 'attachment; filename=backup_completo.sql');
}


}
