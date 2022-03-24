import dedent from 'dedent-js';
import * as sqlFormatter from '../src/sqlFormatter';
import MySqlFormatter from '../src/languages/mysql.formatter';
import behavesLikeMariaDbFormatter from './behavesLikeMariaDbFormatter';

import supportsStrings from './features/strings';
import supportsOperators from './features/operators';

describe('MySqlFormatter', () => {
	const format = (query, cfg = {}) => sqlFormatter.format(query, { ...cfg, language: 'mysql' });

	behavesLikeMariaDbFormatter(format);

	supportsStrings(format, MySqlFormatter.stringTypes);
	supportsOperators(format, MySqlFormatter.operators, MySqlFormatter.reservedLogicalOperators);

	it('supports @@ system variables', () => {
		const result = format('SELECT @@GLOBAL.time, @@SYSTEM.date, @@hour FROM foo;');
		expect(result).toBe(dedent`
      SELECT
        @@GLOBAL.time,
        @@SYSTEM.date,
        @@hour
      FROM
        foo;
    `);
	});

	it('supports DELIMITER', () => {
		const result = format('DELIMITER $$ CREATE PROCEDURE sp_name() BEGIN END $$	 DELIMITER ;');
		expect(result).toBe(dedent`
        DELIMITER $$
        CREATE PROCEDURE
          sp_name() BEGIN
        END $$
        DELIMITER ;
        `);
	});
});
